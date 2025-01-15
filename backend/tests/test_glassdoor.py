import json

import pytest

from sisyphus.glassdoor.glassdoor import find_companies, find_company


@pytest.mark.skip(reason="not working yet")
def test_find_companies():
    results = find_companies("ebay")
    assert len(results) > 0
    print(json.dumps(results, indent=4))


@pytest.mark.skip(reason="not working yet")
def test_find_company():
    result = find_company("anomalo")
    assert result is not None
    assert len(result) > 0
    print(json.dumps(result, indent=4))
