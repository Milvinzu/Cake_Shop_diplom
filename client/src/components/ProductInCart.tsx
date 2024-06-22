import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  removeFromCart,
  changeQuantity,
} from "../redux/slices/Cart/cartSlices";
import DeletBtn from "../assets/img/Cart/delet.svg";
import rightArrow from "../assets/img/BuyButton/right-arrow.svg";
import leftArrow from "../assets/img/BuyButton/left-arrow.svg";
import "../scss/components/_productInCart.scss";

const ProductItem = ({
  id,
  uniqueKey,
  photo,
  price,
  weight,
  quantity,
  name,
  isNarrow,
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state: RootState) => state.Cart.items);
  const cartItem = cartItems.find((item) => item.uniqueKey === uniqueKey);
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

    // Define language-specific replacements
    const replacements: { [key: string]: string } = {
      кг: lang === "en" ? "kg" : "кг",
      порцій: lang === "en" ? "servings" : "порцій",
    };

    // Replace matching strings in the input
    let parsedStr = str;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(key, "gi"); // "gi" for case-insensitive and global
      parsedStr = parsedStr.replace(regex, replacements[key]);
    });

    return parsedStr;
  };
  useEffect(() => {
    if (cartItem) {
      dispatch(changeQuantity({ uniqueKey, quantity: cartItem.quantity }));
    }
  }, [cartItems, uniqueKey, dispatch]);

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      dispatch(changeQuantity({ uniqueKey, quantity: cartItem.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(changeQuantity({ uniqueKey, quantity: cartItem.quantity - 1 }));
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      dispatch(changeQuantity({ uniqueKey, quantity: newQuantity }));
    }
  };

  if (!cartItem) {
    return null;
  }

  const itemPrice = cartItem.quantity * price;

  return (
    <>
      <div
        className={`sidebar-right-bar-content product-in-cart-sm ${
          isNarrow ? "detailed" : "minimized"
        }`}
      >
        <div className="product-in-cart-sm-img">
          <img src={photo} alt="Product" />
        </div>
        <div className="product-in-cart-sm-price">
          <span>{itemPrice}</span>
        </div>
      </div>

      <div
        className={`sidebar-right-bar-content product-in-cart-lg ${
          isNarrow ? "detailed" : "minimized"
        }`}
      >
        <div className="product-in-cart-lg-img">
          <img src={photo} alt="Product" />
        </div>
        <div className="product-in-cart-lg-info">
          <div className="product-in-cart-lg-info-name">
            <span>{parseLocalizedString(name, currentLang)}</span> <br />
            <span> / {parseLocalizedStringWeight(weight, currentLang)}</span>
            <span className="product-in-cart-lg-info-name-delet">
              <img
                src={DeletBtn}
                alt="Delete"
                onClick={() => dispatch(removeFromCart(uniqueKey))}
              />
            </span>
          </div>
          <div className="product-in-cart-lg-info-price">
            <span>
              {itemPrice} {t("UAH")}
            </span>
            <div className="product-in-cart-lg-info-price-quantity-controls">
              <img
                src={leftArrow}
                alt="Decrease Quantity"
                onClick={handleDecreaseQuantity}
              />
              <input
                value={quantity}
                onChange={handleQuantityChange}
                className="product-in-cart-lg-info-price-quantity-controls-input"
              />
              <img
                src={rightArrow}
                alt="Increase Quantity"
                onClick={handleIncreaseQuantity}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
