import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OrderSummary from "./OrderSummary";
import { useSelector, useDispatch } from "react-redux";
import { selectTotalPrice } from "../redux/slices/Cart/cartSelectors";
import {
  selectUserEmail,
  selectUserFullName,
  selectUserPhoneNumber,
} from "../redux/slices/User/userSelectors";
import { AppDispatch } from "../redux/store";
import { updateUser } from "../redux/slices/User/userAsyncActions";
import { createOrder } from "../redux/slices/Cart/cartAsyncActions";
import LiqPay from "../liqpay/liqpay";
import "../scss/components/_orderForm.scss";

const OrderForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [publicKey, setPublicKey] = useState(process.env.LIQPAY_PUBLIC_KEY);
  const [privateKey, setPrivateKey] = useState(process.env.LIQPAY_PRIVATE_KEY);
  const liqpay = new LiqPay(publicKey, privateKey);

  const { t, i18n } = useTranslation();

  const totalPrice = useSelector(selectTotalPrice);
  const userEmail = useSelector(selectUserEmail);
  const userFullName = useSelector(selectUserFullName);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [currentTotalPrice, setCurrentTotalPrice] = useState(totalPrice);
  const [lastName, setLastName] = useState(userFullName?.split(" ")[1] || "");
  const [firstName, setFirstName] = useState(userFullName?.split(" ")[0] || "");
  const [phone, setPhone] = useState(userPhoneNumber || "");
  const [email, setEmail] = useState(userEmail || "");

  const [formErrors, setFormErrors] = useState({
    lastName: false,
    firstName: false,
    phone: false,
    email: false,
    deliveryDate: false,
  });

  useEffect(() => {
    if (deliveryMethod === "courier") {
      setCurrentTotalPrice(totalPrice + 80);
    } else {
      setCurrentTotalPrice(totalPrice);
    }
  }, [deliveryMethod, totalPrice]);

  const validateForm = () => {
    let valid = true;
    const errors = {
      lastName: !lastName,
      firstName: !firstName,
      phone: !phone,
      email: !email,
      deliveryDate: !deliveryDate,
    };

    setFormErrors(errors);

    for (const error of Object.values(errors)) {
      if (error) {
        valid = false;
        break;
      }
    }

    return valid;
  };

  const handlePayment = async () => {
    await dispatch(
      updateUser({
        fullName: `${firstName} ${lastName}`,
        phoneNumber: phone,
        email: email,
      })
    );

    const orderDescription = `Метод доставки: ${deliveryMethod}, Приблизний час доставки: ${deliveryTime}, Дата: ${deliveryDate}`;

    const response = await dispatch(
      createOrder({
        description: orderDescription,
        totalPrice: currentTotalPrice,
      })
    );

    const params = {
      action: "pay",
      amount: currentTotalPrice,
      currency: "UAH",
      description: "Оплата замовлення",
      version: "3",
      language: "uk",
      result_url: `https://cake-shop-6dx1.onrender.com`,
      server_url: `https://cake-shop-3a3k.onrender.com/api/payment-callback`,
      order_id: response.payload._id,
    };

    const form = liqpay.cnb_form(params);
    const formContainer = document.createElement("div");
    formContainer.innerHTML = form;
    document.body.appendChild(formContainer);
    formContainer.querySelector("form").submit();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate < today) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: true,
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: false,
      }));
    }

    setDeliveryDate(selectedDate);
  };

  return (
    <div className="order">
      <div className="order_page">
        <div className="order_form">
          <div className="order_form_contacts" id="contacts">
            <h2>{t("Fill in the details")}</h2>
            <form>
              <div
                className={`form_group ${formErrors.lastName ? "error" : ""}`}
              >
                <label htmlFor="lastName">{t("Last Name")}</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  className="input order_form_item"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {formErrors.lastName && (
                  <span className="error_message">
                    {t("Last name is required")}
                  </span>
                )}
              </div>
              <div
                className={`form_group ${formErrors.firstName ? "error" : ""}`}
              >
                <label htmlFor="firstName">{t("First Name")}</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  className="input order_form_item"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {formErrors.firstName && (
                  <span className="error_message">
                    {t("First name is required")}
                  </span>
                )}
              </div>
              <div className={`form_group ${formErrors.phone ? "error" : ""}`}>
                <label htmlFor="phone">{t("Contact phone number")}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  className="input order_form_item"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {formErrors.phone && (
                  <span className="error_message">
                    {t("Phone number is required")}
                  </span>
                )}
              </div>
              <div className={`form_group ${formErrors.email ? "error" : ""}`}>
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  className="input order_form_item"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {formErrors.email && (
                  <span className="error_message">
                    {t("Email is required")}
                  </span>
                )}
              </div>
            </form>
          </div>
          <div className="order_form_delivery" id="delivery">
            <h2>{t("Choose a delivery method")}</h2>
            <form>
              <div className="form_group">
                <input
                  type="radio"
                  id="delivery1"
                  name="deliveryMethod"
                  value="courier"
                  className="input order_form_item"
                  checked={deliveryMethod === "courier"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  required
                />
                <label htmlFor="delivery1">
                  {t("By courier in Kharkiv (80 UAH)")}
                </label>
              </div>
              <div className="form_group">
                <input
                  type="radio"
                  id="delivery2"
                  name="deliveryMethod"
                  value="pickup"
                  className="input order_form_item"
                  checked={deliveryMethod === "pickup"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  required
                />
                <label htmlFor="delivery2">{t("FirstPickup")}</label>
              </div>
              <div className="form_group">
                <input
                  type="radio"
                  id="delivery3"
                  name="deliveryMethod"
                  value="taxi"
                  className="input order_form_item"
                  checked={deliveryMethod === "taxi"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  required
                />
                <label htmlFor="delivery3">{t("Delivery by taxi")}</label>
              </div>
            </form>
            {deliveryMethod === "courier" && (
              <div className="form_group">
                <label htmlFor="deliveryTime">{t("Delivery time")}</label>
                <select
                  id="deliveryTime"
                  name="deliveryTime"
                  value={deliveryTime}
                  className="input order_form_item"
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                >
                  <option value="">{t("Choose a time")}</option>
                  <option value="9-15">{t("FistTimeGap")}</option>
                  <option value="15-19">{t("SecondTimeGap")}</option>
                </select>
              </div>
            )}
            {deliveryMethod !== "courier" && (
              <div className="form_group">
                <label htmlFor="deliveryTime">
                  {t("Desired delivery time")}
                </label>
                <input
                  type="text"
                  id="deliveryTime"
                  name="deliveryTime"
                  className="input order_form_item"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="Наприклад: 14:00"
                  required
                />
              </div>
            )}
            {deliveryMethod !== "pickup" && (
              <>
                <h2>{t("Enter the delivery address")}</h2>
                <form>
                  <div className="form_group">
                    <label htmlFor="street">{t("Street")}</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      className="input order_form_item"
                      required
                    />
                  </div>
                  <div className="form_group">
                    <label htmlFor="building">{t("house")}</label>
                    <input
                      type="text"
                      id="building"
                      name="building"
                      className="input order_form_item"
                      required
                    />
                  </div>
                  <div className="form_group">
                    <label htmlFor="apartment">{t("apartment")}</label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      className="input order_form_item"
                      required
                    />
                  </div>
                </form>
              </>
            )}
            <h2>{t("Choose a delivery date")}</h2>
            <div className="form_group">
              <label htmlFor="deliveryDate">{t("Delivery date")}</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={deliveryDate}
                className="input"
                onChange={(e) => handleDateChange(e)}
                required
              />
              {formErrors.deliveryDate && (
                <span className="error_message">
                  {t("Delivery date must be in the future")}
                </span>
              )}
            </div>
          </div>
          <div className="order_form_payment" id="payment">
            <p>{t("Payment")}</p>
            <button
              className="submit_order_button"
              type="button"
              onClick={handlePayment}
            >
              {t("ToOrder")}
            </button>
          </div>
        </div>
        <div className="order_summary">
          <h2>{t("Order")}</h2>
          <OrderSummary />
          <span>
            {t("Total cost")}: {currentTotalPrice} {t("UAH")}
            {deliveryMethod === "courier" &&
              ` ${t("includes 80 UAH delivery")}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
