import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios"; // You can use axios or fetch for API calls
import { debounce } from "lodash"; // Optional: Use lodash to debounce input

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (query.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${query}`); // Server-side search API endpoint
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex justify-center w-full border-[1px] rounded-full px-5 py-3 gap-3 border-[#242F40] bg-white shadow-md transition-all focus-within:ring-2 focus-within:ring-[#242F40] mx-3">
      <Search className="text-gray-400" />
      <input
        type="text"
        placeholder="Search for a cafe, university, or etc."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        aria-label="Search input"
      />
      <div className="absolute w-full bg-white border-t-2 rounded-b-lg shadow-lg mt-2">
        {loading ? (
          <div className="p-3 text-center text-gray-500">Loading...</div>
        ) : (
          searchResults.map((result:any, index) => (
            <div key={index} className="p-3 cursor-pointer hover:bg-gray-100">
              {result.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchBar;
