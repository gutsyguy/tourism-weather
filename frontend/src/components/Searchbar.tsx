// frontend/src/components/Searchbar.tsx
"use client";

import React from "react";
import { Station } from "@/types/station";
import { useIsClient } from "@/hooks/useIsClientHook";

// Define props type
export type SearchbarProps = {
  searchList: Station[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Searchbar: React.FC<SearchbarProps> = ({
  searchList,
  searchTerm,
  setSearchTerm,
}) => {
  const isClient = useIsClient();

  // Prevent server-side rendering
  if (!isClient) return null;

  const filteredSearch = searchList.filter((item) =>
    item.timezone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by timezone (e.g. UTC, PST, EST)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm ? (
        <div>
          <h2>Search Results:</h2>
          {filteredSearch.length > 0 ? (
            filteredSearch.map((item) => (
              <div key={item.station_id}>
                <h3>{item.station_name}</h3>
                <p>{item.timezone}</p>
              </div>
            ))
          ) : (
            <p>No stations match this timezone.</p>
          )}
        </div>
      ) : (
        <div>No results</div>
      )}
    </div>
  );
};

export default Searchbar;
