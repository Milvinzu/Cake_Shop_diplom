import React, { useState } from "react";
import "../../scss/components/ManagePanel/_menuPanel.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchProductsByCategory } from "../../redux/slices/Product/productsAsyncActions";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

import ProductManagement from "./ProductManagement";
import CakeManagement from "./CakeManagement";
import AdminGift from "./AdminGift";
import OrderManagement from "./OrderManagement";
import SpecialCakeManagement from "./SpecialCakeManagement";

const MenuPanel: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const [activeComponent, setActiveComponent] =
    useState<string>("ProductManagement");

  const handleFetchProductsByCategory = (category: string) => {
    dispatch(fetchProductsByCategory(category));
    setActiveComponent("ProductManagement");
  };

  const handleSwitchComponent = (component: string) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "ProductManagement":
        return <ProductManagement />;
      case "CakeManagement":
        return <CakeManagement />;
      case "AdminGift":
        return <AdminGift />;
      case "Order":
        return <OrderManagement />;
      case "SpecialCake":
        return <SpecialCakeManagement />;
      default:
        return t("Nothing selected");
    }
  };

  return (
    <div className="menu-panel">
      <div className="menu-panel__sidebar">
        <button onClick={() => handleFetchProductsByCategory("RegularCakes")}>
          {t("Regular Product")}
        </button>
        <button onClick={() => handleSwitchComponent("CakeManagement")}>
          {t("Cake Management")}
        </button>
        <button onClick={() => handleSwitchComponent("AdminGift")}>
          {t("Granting the admin role")}
        </button>
        <button onClick={() => handleSwitchComponent("Order")}>
          {t("Order")}
        </button>
        <button onClick={() => handleSwitchComponent("SpecialCake")}>
          {t("Specialty cakes")}
        </button>
      </div>
      <div className="menu-panel__content">{renderComponent()}</div>
    </div>
  );
};

export default MenuPanel;
