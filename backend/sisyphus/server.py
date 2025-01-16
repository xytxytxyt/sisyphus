from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from sisyphus.linkedin.linkedin import (
    SearchConfig,
    get_job,
    get_search_config,
    get_search_configs,
    initialize_linkedin,
    search_jobs,
)

app = FastAPI()


class LinkedInSearchConfigs(BaseModel):
    configs: dict[str, SearchConfig]


@app.get("/linkedin/search_configs")
async def linkedin_search_configs() -> LinkedInSearchConfigs:
    """
    Return all LinkedIn search configs
    """
    linkedin_search_configs = LinkedInSearchConfigs(configs=get_search_configs())
    return linkedin_search_configs


class JobSearchResult(BaseModel):
    id: str
    title: str
    poster_id: str


@app.post("/linkedin/search_jobs/{search_config_name}")
async def linkedin_search_jobs(search_config_name: str) -> list[JobSearchResult]:
    """
    Given a LinkedIn search config name, performs a search with that config and returns results
    """
    search_config = get_search_config(search_config_name)
    if search_config is None:
        raise HTTPException(
            status_code=404,
            detail=f"Search config named {search_config_name} not found",
        )
    linkedin = initialize_linkedin()
    results = search_jobs(
        linkedin=linkedin,
        config=search_config,
    )
    api_results: list[JobSearchResult] = []
    for result in results:
        api_results.append(
            JobSearchResult(
                id=result["trackingUrn"].split(":")[-1],
                title=result["title"],
                poster_id=result["posterId"],
            )
        )
    return api_results


class LinkedInCompany(BaseModel):
    id: str
    name: str
    url: str


@app.get("/linkedin/job/{job_id}/company")
async def linkedin_get_company_from_job(job_id: str) -> LinkedInCompany:
    """
    Given a LinkedIn job id, get company information
    """
    linkedin = initialize_linkedin()
    job = get_job(
        linkedin=linkedin,
        job_id=job_id,
    )
    company_details = job["companyDetails"]
    company_resolution_result = company_details[list(company_details.keys())[0]][
        "companyResolutionResult"
    ]
    company = LinkedInCompany(
        id=company_resolution_result["entityUrn"].split(":")[-1],
        name=company_resolution_result["name"],
        url=company_resolution_result["url"],
    )
    return company
