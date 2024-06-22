import React from "react";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";
import LoadingProducts from "./LoadingProducts";
import "../scss/components/_category.scss";
import { Product } from "../redux/slices/Product/types";
import { RootState } from "../redux/store";

interface ProductListProps {
  products: Product[];
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, category }) => {
  const loading = useSelector((state: RootState) => state.Products.loading);

  return (
    <>
      <h3 className="product-category">{category}</h3>
      <div className="product-list">
        {loading === "loading" ? (
          <LoadingProducts />
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              photo={product.img}
              name={product.name}
              price={product.price}
              id={product._id}
              category={category}
            />
          ))
        )}
      </div>
    </>
  );
};

export default ProductList;
