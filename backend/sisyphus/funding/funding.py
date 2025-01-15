import re

import requests
from bs4 import BeautifulSoup


def google_search(
    query: str,
    keywords: list[str],
) -> list[str]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
    }
    search_url = f"https://www.google.com/search?q={query}"
    response = requests.get(search_url, headers=headers)
    assert response.ok
    soup = BeautifulSoup(response.text, "html.parser")
    return [
        str(elem)
        for elem in soup.find_all(
            string=re.compile("|".join(f"({keyword})" for keyword in keywords))
        )
    ]


def search_company_funding(company_name: str) -> list[str]:
    funding_keywords = [
        "raise",
        "eries",
        "seed",
        "million",
    ]
    return google_search(
        query=f"site:techcrunch.com OR site:venturebeat.com {company_name} funding raise round",
        keywords=funding_keywords,
    )
