import React, { createContext, useContext, useState } from 'react';

const ProductsContext= createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(null);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
