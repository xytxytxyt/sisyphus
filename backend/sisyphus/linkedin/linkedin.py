import json
from dataclasses import dataclass
from functools import cache
from typing import List, Literal

import yaml
from dataclasses_json import DataClassJsonMixin
from linkedin_api import Linkedin
from linkedin_api.cookie_repository import CookieRepository
from requests.cookies import RequestsCookieJar, create_cookie

credentials_config_path = "configs/linkedin_credentials.yaml"
search_config_path = "configs/linkedin_search.yaml"
cookies_path = "configs/linkedin_cookies.json"


@dataclass
class CredentialsConfig(DataClassJsonMixin):
    username: str
    password: str


# https://linkedin-api.readthedocs.io/en/latest/api.html#linkedin_api.Linkedin.search_jobs
@dataclass
class SearchConfig(DataClassJsonMixin):
    config_name: str
    keywords: str
    experience: List[Literal["1", "2", "3", "4", "5", "6"]] | None
    job_type: List[Literal["F", "C", "P", "T", "I", "V", "O"]] | None
    remote: List[Literal["1", "2", "3"]]
    listed_at: int  # maximum number of seconds passed since job posting
    min_salary: int | None
    exclude: List[str]


@cache
def get_credentials() -> CredentialsConfig:
    with open(credentials_config_path) as f:
        return CredentialsConfig.from_dict(yaml.safe_load(f.read()))


# https://github.com/tomquirk/linkedin-api/issues/331
def set_cookies():
    with open(cookies_path) as f:
        cookies = json.loads(f.read())

        cookie_jar = RequestsCookieJar()

        for cookie_data in cookies:
            cookie = create_cookie(
                domain=cookie_data["domain"],
                name=cookie_data["name"],
                value=cookie_data["value"],
                path=cookie_data["path"],
                secure=cookie_data["secure"],
                expires=cookie_data.get("expirationDate", None),
                rest={
                    "HttpOnly": cookie_data.get("httpOnly", False),
                    "SameSite": cookie_data.get("sameSite", "unspecified"),
                    "HostOnly": cookie_data.get("hostOnly", False),
                },
            )
            cookie_jar.set_cookie(cookie)

        new_repo = CookieRepository()
        new_repo.save(cookie_jar, "email_or_username")


@cache
def initialize_linkedin():
    credentials = get_credentials()
    set_cookies()
    return Linkedin(username=credentials.username, password=credentials.password)


@cache
def get_search_configs() -> dict[str, SearchConfig]:
    with open(search_config_path) as f:
        configs_yaml_dict = yaml.safe_load(f.read())
        configs = {}
        for config_name in configs_yaml_dict:
            configs[config_name] = SearchConfig.from_dict(
                configs_yaml_dict[config_name]
            )
        return configs


def reload_search_configs():
    get_search_configs.cache_clear()
    get_search_configs()


def get_search_config(name: str) -> SearchConfig | None:
    return get_search_configs().get(name)


def search_jobs(linkedin: Linkedin, config: SearchConfig) -> List[dict]:
    kwargs = config.to_dict()
    if "limit" not in kwargs:
        kwargs["limit"] = 10
    return linkedin.search_jobs(**kwargs)


def get_job(linkedin: Linkedin, job_id: str) -> dict:
    return linkedin.get_job(job_id)
