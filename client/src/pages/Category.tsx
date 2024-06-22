import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByCategory,
  fetchCakeProducts,
} from "../redux/slices/Product/productsAsyncActions";
import { RootState, AppDispatch } from "../redux/store";
import ProductList from "../components/ProductList";
import { Product } from "../redux/slices/Product/types";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.Products.products);
  const loading = useSelector((state: RootState) => state.Products.loading);

  useEffect(() => {
    if (category) {
      if (category.toLowerCase() === "cake") {
        dispatch(fetchCakeProducts());
      } else {
        dispatch(fetchProductsByCategory(category));
      }
    }
  }, [dispatch, category]);

  const categoryProducts = products.filter(
    (product: Product) =>
      (category === "Cake" && product.category === null) ||
      (product.category &&
        category &&
        product.category.toLowerCase() === category.toLowerCase())
  );

  if (loading === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="category-page">
        <ProductList
          products={categoryProducts}
          category={category?.charAt(0).toUpperCase() + category.slice(1)}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
