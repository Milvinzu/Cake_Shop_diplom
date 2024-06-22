import React from "react";
import AdminProductItem from "./AdminProductItem";
import "../../scss/components/_category.scss";
import { Product } from "../../redux/slices/Product/types";

interface AdminProductListProps {
  products: Product[];
  category: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedProduct: Product) => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({
  products,
  category,
  onDelete,
  onUpdate,
}) => {
  return (
    <>
      <h3 className="product-category" style={{ paddingTop: 0 }}>
        {category}
      </h3>
      <div className="product-list">
        {products.map((product) => (
          <AdminProductItem
            key={product._id}
            photo={product.img}
            name={product.name}
            price={product.price}
            id={product._id}
            category={product.category}
            description={product.description}
            weight={product.weight}
            img={product.img}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </>
  );
};

export default AdminProductList;
