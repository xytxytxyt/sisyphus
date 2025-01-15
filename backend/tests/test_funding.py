from sisyphus.funding.funding import search_company_funding


def test_search_company_funding():
    company_name = "anomalo"
    snippets = search_company_funding(company_name)
    assert len(snippets) > 0
    for snippet in snippets:
        print(snippet)
