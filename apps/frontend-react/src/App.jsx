import React, { useState, useEffect } from 'react';

// The main App component handles the search functionality and display.
// It uses Tailwind CSS classes for styling (assuming Tailwind is set up in the environment).
function App() {
  // State for the user's search query input
  const [query, setQuery] = useState('mallorca');
  // State to hold the fetched search results
  const [results, setResults] = useState([]);
  // State to manage loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to handle and display API errors
  const [error, setError] = useState(null);
  // State to trigger the search (used for the search button click)
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Define the base URL for the local API (Used for reference only now)
  const API_BASE_URL = "/api/search";

  // Flag to determine if we should use the local (CORS-blocked) API or the mock function
  // In this development environment, we must use the mock function.
  const USE_MOCK_API = false;

  // useEffect hook to fetch data whenever the searchTrigger state changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const encodedQuery = encodeURIComponent(query);

      try {
        let data;

        // Original code path (requires CORS setup on http://localhost:8000)
        const apiUrl = `${API_BASE_URL}?q=${encodedQuery}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();


        // Process the result data (works for both mock and real data structures)
        if (data && Array.isArray(data.results)) {
            setResults(data.results);
        } else {
            setResults([]);
            // Throwing error here will trigger the catch block below
            throw new Error("Invalid data structure received.");
        }

      } catch (e) {
        console.error("Fetch/Data error:", e);
        // Provide user-friendly error message, pointing out the necessary change for external use
        const apiType = USE_MOCK_API ? 'Mock Data' : 'External API';
        setError(`Data Error from ${apiType}. Check console for details. (Message: ${e.message})`);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Note: The dependency array must remain [searchTrigger] to control when fetching occurs.
  }, [searchTrigger]);

  // Handler for the form submission (Search button click)
  const handleSearch = (e) => {
    e.preventDefault();
    // Increment the searchTrigger state to re-run the useEffect hook
    setSearchTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <header className="py-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700">Simple Search App (MOCKED)</h1>
          <p className="text-gray-500 mt-1">
             Fetching results using internal mock data.
             <br/>
             <span className="text-xs text-gray-400">Original API: <code className="text-xs font-mono">{API_BASE_URL}?q={query}</code></span>
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex space-x-2 mb-8 p-4 bg-white shadow-lg rounded-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query (e.g., mallorca or ibiza)"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md disabled:opacity-50"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Status Messages */}
        {loading && (
          <div className="text-center p-4 text-blue-600 font-medium">
            Loading results from mock API...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          {!loading && !error && results.length === 0 && (
            <div className="text-center p-4 text-gray-500 italic">
              No mock results found for "{query}".
            </div>
          )}

          {results.map((result) => (
            <div key={result.id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition duration-150 block"
              >
                {result.title}
              </a>
              <p className="text-gray-700 mt-2 line-clamp-3">{result.snippet}</p>
              <p className="text-sm text-green-600 mt-3 truncate">
                {result.url}
              </p>
            </div>
          ))}
        </div>

        {/* Footer for result count */}
        {!loading && !error && results.length > 0 && (
            <div className="mt-8 text-center text-gray-500 text-sm">
                Displaying {results.length} mocked results.
            </div>
        )}
      </div>
    </div>
  );
}

export default App;