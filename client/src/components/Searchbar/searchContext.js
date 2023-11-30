import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function useSearchContext() {
  return useContext(SearchContext);
}

export function SearchProductProvider({ children }) {
  const [searchRoute, setSearchRoute] = useState(false);

  return (
    <SearchContext.Provider value={{ searchRoute, setSearchRoute }}>
      {children}
    </SearchContext.Provider>
  );
}
