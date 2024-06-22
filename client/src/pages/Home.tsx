import React from "react";

import CategoryRow from "../components/CategoryRow";
import Carousel from "../components/Carousel";
import ProductCarousel from "../components/TopProducts";

const Home: React.FC = () => {
  return (
    <>
      <Carousel />
      <div className="container">
        <CategoryRow />
        <ProductCarousel />
      </div>
    </>
  );
};

export default Home;
