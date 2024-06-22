import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchUnknownProductById } from "../redux/slices/searchSlice";

import CakeDetail from "../components/ProductDetail/CakeDetail";
import EclairDetail from "../components/ProductDetail/EclairDetail";
import MarshmallowDetail from "../components/ProductDetail/MarshmallowDetail";
import MacaronDetail from "../components/ProductDetail/MacaronDetail";
import TartDetail from "../components/ProductDetail/TartDetail";
import PastryDetail from "../components/ProductDetail/PastryDetail";

const SearchResultDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const product = useSelector((state: RootState) =>
    state.search.filteredProducts.find((item) => item._id === productId)
  );

  const productStatus = useSelector(
    (state: RootState) => state.Products.loading
  );
  const productError = useSelector((state: RootState) => state.Products.error);

  useEffect(() => {
    dispatch(fetchUnknownProductById(product._id));
  }, [dispatch, productId, product]);

  if (productStatus === "loading") {
    return <h2>Loading...</h2>;
  }

  if (productError) {
    return <h2>Error: {productError}</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const renderComponent = () => {
    switch (product.category) {
      case "Cake":
        return <CakeDetail product={product} />;
      case "Eclair":
        return <EclairDetail product={product} />;
      case "Marshmallow":
        return <MarshmallowDetail product={product} />;
      case "Macaron":
        return <MacaronDetail product={product} />;
      case "Tart":
        return <TartDetail product={product} />;
      case "Pastry":
        return <PastryDetail product={product} />;
      default:
        return (
          <div className="container">
            Запитувана сторінка не знайдена! Упс, запитувана Вами сторінка не
            знайдена. Ймовірно, сторінка була вилучена, переміщена або зараз
            вона тимчасово недоступна!
            <a href="/#">На головну</a>
          </div>
        );
    }
  };

  return <div className="container">{renderComponent()}</div>;
};

export default SearchResultDetail;
