import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecialCakesByUserId,
  updateSpecialCake,
  selectSpecialCakes,
  selectSpecialCakesLoading,
  selectSpecialCakesError,
} from "../redux/slices/specialCakeSlice";
import { selectUser } from "../redux/slices/User/userSelectors";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../redux/store";
import config from "config";
import "../scss/components/_orderHistory.scss";
import LiqPay from "../liqpay/liqpay";
import Loader from "./Loader";

interface SpecialCake {
  _id: string;
  description: string;
  price?: number;
  userId: string;
  status: string;
}

const statusTranslation = {
  sent: "відправлено",
  recieved: "отримано",
  paid: "оплачено",
  processing: "обробляється",
  cooking: "готується",
  done: "готово",
  "on the way": "у дорозі",
  delivered: "доставлено",
};

const OrderCustomCake: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const specialCakes = useSelector(selectSpecialCakes);
  const loading = useSelector(selectSpecialCakesLoading);
  const error = useSelector(selectSpecialCakesError);
  const [publicKey, setPublicKey] = useState(process.env.LIQPAY_PUBLIC_KEY);
  const [privateKey, setPrivateKey] = useState(process.env.LIQPAY_PRIVATE_KEY);
  const liqpay = new LiqPay(publicKey, privateKey);

  const [expandedCakeId, setExpandedCakeId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchSpecialCakesByUserId(user._id));
    }
  }, [dispatch, user]);

  const toggleCakeDetails = (cakeId: string) => {
    setExpandedCakeId(expandedCakeId === cakeId ? null : cakeId);
  };

  const handlePayment = (cake: SpecialCake) => {
    const params = {
      action: "pay",
      amount: cake.price,
      currency: "UAH",
      description: "Оплата спеціального торту",
      version: "3",
      language: "uk",
      result_url: `https://cake-shop-6dx1.onrender.com`,
      server_url: `${config.API_BASE_URL}/api/payment-callback/specialcake`,
      order_id: cake._id,
    };

    const form = liqpay.cnb_form(params);
    const formContainer = document.createElement("div");
    formContainer.innerHTML = form;
    document.body.appendChild(formContainer);
    formContainer.querySelector("form").submit();
  };

  if (loading)
    return (
      <div className="loading">
        <Loader />
      </div>
    );
  if (error) return <p>{t("Error loading special cakes")}</p>;

  return (
    <div className="order-history">
      <h2>{t("Special Cake History")}</h2>
      {specialCakes.length === 0 ? (
        <p>{t("No special cakes found")}</p>
      ) : (
        specialCakes.map((cake) => (
          <div key={cake._id} className="order">
            <div
              className="order-summary"
              onClick={() => toggleCakeDetails(cake._id)}
            >
              <h3>Номер замовлення: {cake._id}</h3>
              <p>Статус: {statusTranslation[cake.status]}</p>
              <p>
                {t("Price")}: {cake.price} грн
              </p>
            </div>
            {expandedCakeId === cake._id && (
              <div className="order-details">
                <p>
                  Опис:{" "}
                  {cake.description.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <p>
                  {t("Price")}: {cake.price} грн
                </p>
                <p>Статус: {statusTranslation[cake.status]}</p>
                {cake.status === "recieved" && (
                  <button
                    onClick={() => handlePayment(cake)}
                    className="btn pay-btn"
                  >
                    Передплатити замовлення
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderCustomCake;
