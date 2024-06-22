import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ProductList from "../components/ProductList";

const SearchResultsPage: React.FC = () => {
  const filteredProducts = useSelector(
    (state: RootState) => state.search.filteredProducts
  );

  return (
    <div className="search-results-page">
      <h2>Search Results</h2>
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} category="Search Results" />
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
