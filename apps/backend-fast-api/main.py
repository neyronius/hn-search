from fastapi import FastAPI, APIRouter, Query
from typing import List, Dict, Any

# 1. Initialize the FastAPI application
app = FastAPI(title="Simple Search API")

api_router = APIRouter(prefix="/api")

# Hardcoded list of search results
HARDCODED_RESULTS: List[Dict[str, Any]] = [
    {"id": 1, "title": "Result One", "snippet": "This is the first search result.", "url": "https://example.com/one"},
    {"id": 2, "title": "Result Two", "snippet": "This is the second search result.", "url": "https://example.com/two"},
    {"id": 3, "title": "Result Three", "snippet": "This is the third search result.", "url": "https://example.com/three"},
]

@api_router.get("/search")
async def search_results(
    q: str = Query(..., description="The query string to search for")
):
    """
    Searches for results based on the provided query string 'q'.
    Returns a hardcoded list of results for simplicity.
    """
    # In a real application, you would use the 'q' variable to filter/fetch results.
    # For this simple example, we ignore 'q' and return the hardcoded list.

    response_data = {
        "query": q,
        "results_count": len(HARDCODED_RESULTS),
        "results": HARDCODED_RESULTS
    }

    return response_data

app.include_router(api_router)

# Optional: Add a root endpoint for easy verification
@app.get("/")
async def root():
    return {"message": "Welcome to the Simple FastAPI Search API"}