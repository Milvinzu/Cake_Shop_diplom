import React from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../redux/slices/Cart/types";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  changeQuantity,
} from "../redux/slices/Cart/cartSlices";

import "../scss/components/_orderSummaryItem.scss";

interface ProductProps {
  product: Product;
}

const OrderSummaryItem: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const parseLocalizedString = (str: string | undefined, lang: string) => {
    if (typeof str !== "string") {
      return "";
    }
    if (str.includes("%eng%")) {
      const parts = str.split("%eng%");
      return lang === "en" && parts[1] ? parts[1] : parts[0];
    } else {
      return str;
    }
  };

  const parseLocalizedStringWeight = (
    str: string | undefined,
    lang: string
  ) => {
    if (typeof str !== "string") {
      return "";
    }

    const replacements: { [key: string]: string } = {
      кг: lang === "en" ? "kg" : "кг",
      порцій: lang === "en" ? "servings" : "порцій",
    };

    let parsedStr = str;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(key, "gi");
      parsedStr = parsedStr.replace(regex, replacements[key]);
    });

    return parsedStr;
  };
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.uniqueKey));
  };

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(event.target.value);
    if (quantity > 0) {
      dispatch(changeQuantity({ uniqueKey: product.uniqueKey, quantity }));
    }
  };

  return (
    <div className="order-summary-item">
      <img src={product.photo} alt={product.name} />
      <h2>{parseLocalizedString(product.name, currentLang)}</h2>
      <p>{parseLocalizedString(product.flavorName, currentLang)}</p>
      <p>{parseLocalizedStringWeight(product.weight, currentLang)}</p>
      <div className="quantity-controls">
        <button onClick={handleRemoveFromCart}>-</button>
        <input
          type="number"
          value={product.quantity}
          onChange={handleChangeQuantity}
        />
        <button onClick={handleAddToCart}>+</button>
      </div>
      <p className="price">
        {product.price} {t("UAH")}
      </p>
    </div>
  );
};

export default OrderSummaryItem;
