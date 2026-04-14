.PHONY: help install serve build check deploy freeze
VENV_BIN := .venv/bin

help:
	@echo 'Targets:'
	@echo '  make install   - create venv and install pinned deps'
	@echo '  make serve     - local preview (http://127.0.0.1:8000)'
	@echo '  make build     - build site/'
	@echo '  make check     - strict build (CI-equivalent)'
	@echo '  make freeze    - update requirements.txt from current venv'

install:
	python -m venv .venv
	$(VENV_BIN)/pip install --upgrade pip
	$(VENV_BIN)/pip install -r requirements.txt

serve:
	$(VENV_BIN)/mkdocs serve

build:
	$(VENV_BIN)/mkdocs build --clean

check:
	$(VENV_BIN)/mkdocs build --strict --clean

freeze:
	$(VENV_BIN)/pip freeze | grep -E '^(mkdocs|Markdown|Pygments|pymdown)' > requirements.txt