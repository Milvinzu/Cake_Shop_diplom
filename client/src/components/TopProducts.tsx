import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductItem from "./ProductItem";
import { fetchTopProducts } from "../redux/slices/Product/productsAsyncActions";
import { RootState, AppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import "../scss/components/_productCarousel.scss";

const ProductCarousel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.Products.products);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="product-carousel-wrapper">
      <h2 className="product-carousel-title">{t("Top 10 products")}</h2>
      <Carousel
        responsive={responsive}
        autoPlaySpeed={1000}
        transitionDuration={500}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        showDots={true}
        containerClass="product-carousel-container"
      >
        {products.map((product) => (
          <div className="product-carousel-item" key={product._id}>
            <ProductItem
              photo={product.img}
              price={product.price}
              name={product.name}
              id={product._id}
              category={product.category} // Pass category prop if available
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
