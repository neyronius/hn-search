# Makefile for backend-fast-api project

# Define variables
PYTHON_ENV := .venv
UVICORN_COMMAND := uvicorn main:app --reload

# --------------------------------------------------------------------------
# Main Targets
# --------------------------------------------------------------------------

.PHONY: install
install: # Install dependencies using uv
	@echo "Installing dependencies using uv..."
	uv pip install fastapi uvicorn

.PHONY: run
run: install # Run the FastAPI application in development mode (with --reload)
	@echo "Starting FastAPI server in development mode..."
	# Check if the environment is active before running
	@if [ -d "$(PYTHON_ENV)" ]; then \
		source $(PYTHON_ENV)/bin/activate; \
		$(UVICORN_COMMAND); \
	else \
		echo "Virtual environment ($(PYTHON_ENV)) not found. Please run 'make install' first."; \
	fi