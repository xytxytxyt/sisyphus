lint-check:
	isort --check-only --diff --profile black sisyphus tests
	black --check --diff sisyphus tests
	flake8 --ignore E501 sisyphus tests

lint-fix:
	isort --profile black sisyphus tests
	black sisyphus tests

check-types:
	mypy --ignore-missing-imports --check-untyped-defs --install-types --non-interactive sisyphus tests

test:
	pytest -svv tests
