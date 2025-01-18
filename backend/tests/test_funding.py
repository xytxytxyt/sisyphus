import pytest

from sisyphus.funding.funding import search_company_funding


@pytest.mark.skip(reason="doesn't work behind vpn; moved to frontend")
def test_search_company_funding():
    company_name = "anomalo"
    snippets = search_company_funding(company_name)
    assert len(snippets) > 0
    for snippet in snippets:
        print(snippet)
