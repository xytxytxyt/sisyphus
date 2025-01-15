import json
import re
from dataclasses import dataclass

import requests
from dataclasses_json import DataClassJsonMixin

user_agent_key = "User-Agent"
user_agent_value = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
cookies = {
    "tldp": "1",  # united states location
}


@dataclass
class Company(DataClassJsonMixin):
    id: int
    name: str
    website: str | None


def find_companies(company_name: str) -> list[dict]:
    headers = {
        user_agent_key: user_agent_value,
        "Accept": "application/json",
    }
    response = requests.get(
        url=f"https://www.glassdoor.com/api-web/employer/find.htm?autocomplete=true&maxEmployersForAutocomplete=50&term={company_name}",
        headers=headers,
        cookies=cookies,
    )
    print(response.text)
    assert response.ok
    results = []
    data = response.json()
    for datum in data:
        if "id" in datum and "label" in datum:
            company = Company(
                id=datum["id"],
                name=datum["label"],
                website=datum.get("website"),
            )
        results.append(company.to_dict())
    return results


def find_company(company_name: str) -> dict | None:
    possible_companies = find_companies(company_name)
    if len(possible_companies) < 1:
        return None

    company: Company = Company.from_dict(possible_companies[0])

    url = f"https://www.glassdoor.com/Overview/Worksgr-at-{company.name}-EI_IE{company.id}.htm"
    response = requests.get(
        url=url,
        headers={
            user_agent_key: user_agent_value,
        },
        cookies=cookies,
    )
    print(response.text)
    assert response.ok

    return extract_apollo_state(response.text)


def extract_apollo_state(html: str) -> dict:
    data = re.findall(r'apolloState":\s*({.+})};', html)[0]
    return json.loads(data)
