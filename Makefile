.PHONY: help install dev build test lint format clean

help:
	@echo "Code Agent - Development Commands"
	@echo ""
	@echo "make install    - Install dependencies"
	@echo "make dev        - Run in development mode"
	@echo "make build      - Build TypeScript"
	@echo "make test       - Run tests"
	@echo "make lint       - Run ESLint"
	@echo "make format     - Format code with Prettier"
	@echo "make clean      - Remove build artifacts"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf dist/ node_modules/ *.log
