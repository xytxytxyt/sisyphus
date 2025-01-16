import json

from sisyphus.linkedin.linkedin import (
    get_credentials,
    get_search_configs,
    initialize_linkedin,
    search_jobs,
)


def test_get_credentials():
    credentials = get_credentials()
    assert len(credentials.to_dict()) > 1


def test_initialize_linkedin():
    initialize_linkedin()


def test_get_search_configs():
    configs = get_search_configs()
    assert len(configs) > 0
    for config_name in configs:
        print(json.dumps(configs[config_name].to_dict(), indent=4))


def test_search_jobs():
    configs = get_search_configs()
    assert len(configs) > 0
    config = configs[list(configs.keys())[0]]
    print(f"searching for {config.config_name}")
    linkedin = initialize_linkedin()
    results = search_jobs(linkedin, config)
    assert len(results) > 0
    print(json.dumps(results, indent=4))
