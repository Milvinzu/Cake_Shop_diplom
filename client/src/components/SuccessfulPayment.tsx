import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../scss/components/_successfulPayment.scss";

const SuccessfulPayment: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-message">
      <h1>{t("Payment was successful")}</h1>
      <p>{t("ThankPurchase")}</p>
      <div className="buttons">
        <button onClick={handleGoHome}>{t("To the main page")}</button>
      </div>
    </div>
  );
};

export default SuccessfulPayment;
