import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchCakeProducts,
  updateCake,
  deleteCake,
} from "../../redux/slices/Product/productsAsyncActions";
import CakeForm from "./CakeForm";
import AdminProductList from "./AdminProductList";
import { Product } from "../../redux/slices/Product/types";

const CakeManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.Products.products);
  const loading = useSelector((state: RootState) => state.Products.loading);

  const handleShowCategory = () => {
    dispatch(fetchCakeProducts());
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCake(id));
  };

  const handleUpdate = (id: string, updatedProduct: Product) => {
    dispatch(updateCake({ _id: id, cake: updatedProduct }));
  };

  return (
    <div>
      <h1>Product Management</h1>
      <CakeForm />
      <button onClick={handleShowCategory}>Відобразити торти</button>
      {loading === "loading" ? (
        <p>Loading...</p>
      ) : (
        <AdminProductList
          products={products}
          category="Cake"
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default CakeManagement;
