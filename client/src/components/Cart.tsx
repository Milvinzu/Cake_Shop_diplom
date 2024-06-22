import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProductInCart from "./ProductInCart";
import { useUser } from "../hooks/use-auth";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import "../scss/components/_cart.scss";

import ArrowBtn from "../assets/img/Cart/arrow_small.svg";
import CabinerBtn from "../assets/img/Cart/user_new.svg";

const Cart = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { isLoggedIn } = useUser();
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state: RootState) => state.Cart.items);
  const totalPrice = useSelector((state: RootState) => {
    const cartItems = state.Cart.items;
    if (!cartItems) return 0;
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
    if (!sidebarExpanded) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  };

  const cabinetButtonClickHandler = () => {
    if (isLoggedIn) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ua" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="bar">
      <div className={`sidebar ${sidebarExpanded ? "detailed" : "minimized"}`}>
        <div
          className={`sidebar-toggle ${
            sidebarExpanded ? "detailed" : "minimized"
          }`}
          onClick={toggleSidebar}
        >
          <img
            src={ArrowBtn}
            width="14"
            className={`sidebar-toggle-img ${
              sidebarExpanded ? "detailed" : "minimized"
            }`}
          />
        </div>
        <div
          className={`sidebar-right-shadow ${
            sidebarExpanded ? "detailed" : "minimized"
          }`}
        ></div>
        <div
          className={`sidebar-right-bar ${
            sidebarExpanded ? "detailed" : "minimized"
          }`}
        >
          <div className="sidebar-right-bar-header">
            <div
              className={`sidebar-right-bar-cabinet ${
                sidebarExpanded ? "detailed" : "minimized"
              }`}
              onClick={cabinetButtonClickHandler}
            >
              <img src={CabinerBtn} width="20" />
            </div>
            {sidebarExpanded && (
              <button
                className="sidebar-right-bar-header-lang btn"
                onClick={toggleLanguage}
              >
                {t("toggle_language")}
              </button>
            )}
          </div>
          {cartItems && cartItems.length > 0 ? (
            <div
              className={`sidebar-right-bar-content ${
                sidebarExpanded ? "detailed" : "minimized"
              }`}
            >
              <div className="total-items-count">
                {cartItems.length} {t("products")}
              </div>
              {cartItems.map((item) => (
                <ProductInCart
                  key={item._id}
                  id={item._id}
                  photo={item.photo}
                  price={item.price}
                  weight={item.weight}
                  name={item.name}
                  uniqueKey={item.uniqueKey}
                  quantity={item.quantity}
                  isNarrow={sidebarExpanded}
                />
              ))}
            </div>
          ) : (
            <div className="empty-cart-text">{t("Cart is empty")}</div>
          )}
          <div>
            <div className="sidebar-right-bar-content-total-price">
              {totalPrice} {t("UAH")}
            </div>
            <div className="sidebar-right-bar-content-order-btn">
              <Link
                className={`btn ${
                  cartItems && cartItems.length > 0 ? "" : "disabled"
                }`}
                to={cartItems && cartItems.length > 0 ? "/order/confirm" : "#"}
              >
                {t("Place an order")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
