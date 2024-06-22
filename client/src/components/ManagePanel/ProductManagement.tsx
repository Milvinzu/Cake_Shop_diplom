import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchProductsByCategory,
  deleteProduct,
  updateProduct,
} from "../../redux/slices/Product/productsAsyncActions";
import ProductForm from "./ProductForm";
import AdminProductList from "./AdminProductList";
import { Product } from "../../redux/slices/Product/types";

const ProductManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.Products.products);

  const loading = useSelector((state: RootState) => state.Products.loading);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Eclair", "Marshmallow", "Macaroni", "Tart", "Pastry"];

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const handleShowCategory = () => {
    dispatch(fetchProductsByCategory(selectedCategory));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const handleUpdate = (id: string, updatedProduct: Product) => {
    const res = dispatch(updateProduct({ ...updatedProduct, _id: id }));
    console.log(res);
    if (res) {
      dispatch(fetchProductsByCategory(selectedCategory));
    }
  };

  return (
    <div>
      <h1>Product Management</h1>
      <ProductForm />
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="input"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={handleShowCategory}>Відобразити цю категорію</button>
      {loading === "loading" ? (
        <p>Loading...</p>
      ) : (
        <AdminProductList
          products={products}
          category={selectedCategory}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ProductManagement;
