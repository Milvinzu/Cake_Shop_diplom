import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "../scss/components/_orderHeader.scss";

import logo from "../assets/img/logo.png";

const OrderHeader: React.FC = () => {
  const [activeSection, setActiveSection] = useState("contacts");
  const { t } = useTranslation();

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <div className="order_header">
        <div className="order_header_logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="order_header_nav">
          <div
            className={`order_header_nav_item ${
              activeSection === "contacts" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("contacts")}
          >
            {t("CONTACT DETAILS")}
          </div>
          <div
            className={`order_header_nav_item ${
              activeSection === "delivery" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("delivery")}
          >
            {t("DELIVERY")}
          </div>
          <div
            className={`order_header_nav_item ${
              activeSection === "payment" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("payment")}
          >
            {t("PAYMENT")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
