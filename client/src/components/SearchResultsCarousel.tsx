import React, { useState } from "react";
import ProductItem from "./ProductItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "../scss/components/_SearchResultsCarousel.scss";

interface SearchResultsCarouselProps {
  secondHeader: boolean;
  mobileMenu: boolean;
}

const SearchResultsCarousel: React.FC<SearchResultsCarouselProps> = ({
  secondHeader,
  mobileMenu,
}) => {
  const products = useSelector(
    (state: RootState) => state.search.filteredProducts
  );
  const [showHeader, setShowHeader] = useState(!secondHeader);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <>
      <div
        className={`search-results-carousel ${
          secondHeader ? "secondHeader" : ""
        } ${mobileMenu ? "mobileMenu" : ""}`}
      >
        <Carousel responsive={responsive}>
          {products.map((product) => (
            <ProductItem
              key={product._id}
              photo={product.img}
              price={product.price}
              name={product.name}
              id={product._id}
              category="Search Results"
            />
          ))}
        </Carousel>
        <div className="wave"></div>
      </div>
    </>
  );
};

export default SearchResultsCarousel;
