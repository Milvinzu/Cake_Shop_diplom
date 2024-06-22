import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { createSpecialCake } from "../redux/slices/specialCakeSlice";
import { useNavigate } from "react-router-dom";

import HowItWorksModal from "./HowItWorksModal";

import "../scss/components/_createCakeForm.scss";

const CreateCakeForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state: RootState) => state.user.email);
  const userFullName = useSelector((state: RootState) => state.user.fullName);
  const userPhoneNumber = useSelector(
    (state: RootState) => state.user.phoneNumber
  );
  const userId = useSelector((state: RootState) => state.user._id);

  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [address, setAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [fullName, setFullName] = useState(userFullName || "");
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber || "");
  const [numPeople, setNumPeople] = useState("");
  const [cakeMessage, setCakeMessage] = useState("");
  const [wish, setWish] = useState("");
  const [preferredCallTime, setPreferredCallTime] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    pickupLocation: "",
    numPeople: "",
    cakeMessage: "",
    wish: "",
    preferredCallTime: "",
  });

  useEffect(() => {
    if (userEmail) setEmail(userEmail);
    if (userFullName) setFullName(userFullName);
    if (userPhoneNumber) setPhoneNumber(userPhoneNumber);
  }, [userEmail, userFullName, userPhoneNumber]);

  const handleDeliveryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryOption(event.target.value);
  };

  const handlePickupLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPickupLocation(event.target.value);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const re = /^\+?3?8?(0\d{9})$/;
    return re.test(phoneNumber);
  };

  const validateForm = () => {
    let formErrors = {
      email: "",
      fullName: "",
      phoneNumber: "",
      address: "",
      pickupLocation: "",
      numPeople: "",
      cakeMessage: "",
      wish: "",
      preferredCallTime: "",
    };
    let isValid = true;

    if (!email || !validateEmail(email)) {
      formErrors.email = "Введіть коректний email";
      isValid = false;
    }
    if (!fullName) {
      formErrors.fullName = "Поле ім'я обов'язкове";
      isValid = false;
    }
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      formErrors.phoneNumber = "Введіть коректний телефон";
      isValid = false;
    }
    if (deliveryOption === "delivery" && !address) {
      formErrors.address = "Поле адреса обов'язкове при доставці";
      isValid = false;
    }
    if (deliveryOption === "pickup" && !pickupLocation) {
      formErrors.pickupLocation = "Виберіть адресу самовивозу";
      isValid = false;
    }
    if (!numPeople) {
      formErrors.numPeople = "Поле кількість персон обов'язкове";
      isValid = false;
    }
    if (!cakeMessage) {
      formErrors.cakeMessage = "Поле напис на торті обов'язкове";
      isValid = false;
    }
    if (!wish) {
      formErrors.wish = "Поле побажання обов'язкове";
      isValid = false;
    }
    if (!preferredCallTime) {
      formErrors.preferredCallTime = "Поле бажаний час дзвінка обов'язкове";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const description = `
      Email: ${email}
      Повне ім'я: ${fullName}
      Номер телефону: ${phoneNumber}
      Спосіб доставки: ${deliveryOption}
      ${
        deliveryOption === "delivery"
          ? `Адреса: ${address}`
          : `Адреса самовивозу: ${pickupLocation}`
      }
      Кількість персон: ${numPeople}
      Напис на торті: ${cakeMessage}
      Побажання: ${wish}
      Бажаний час дзвінка: ${preferredCallTime}
    `;

    try {
      const newCake = await dispatch(
        createSpecialCake({
          description: description,
          price: undefined,
          userId,
        })
      ).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating or updating cake:", error);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isSubmitted) {
    return (
      <div className="create_cake_form thx-form">
        <h2>Дякую за замовлення, ваші побажання в обробці, очікуйте дзвінка</h2>
        <button onClick={handleGoHome} className="submit-button">
          Повернутись на головну сторінку
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="titel-form">ТОРТ НА ЗАМОВЛЕННЯ</h2>
      <div className="create_cake_form">
        <div className="create_cake_form_contact">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          <input
            type="text"
            className="input"
            placeholder="Ім'я"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
          <input
            type="tel"
            className="input"
            placeholder="Телефон"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <span className="error-message">{errors.phoneNumber}</span>
          )}
        </div>
        <div className="create_cake_form_delivery">
          <div className="radio-group">
            <label className={deliveryOption === "pickup" ? "selected" : ""}>
              <input
                type="radio"
                value="pickup"
                checked={deliveryOption === "pickup"}
                onChange={handleDeliveryOptionChange}
              />
              <span className="custom-radio"></span>
              Самовивіз
            </label>
            <label className={deliveryOption === "delivery" ? "selected" : ""}>
              <input
                type="radio"
                value="delivery"
                checked={deliveryOption === "delivery"}
                onChange={handleDeliveryOptionChange}
              />
              <span className="custom-radio"></span>
              Доставка
            </label>
          </div>
          {deliveryOption === "delivery" && (
            <div className="input-group">
              <input
                type="text"
                className="input"
                placeholder="Адреса доставки"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
          )}
          {deliveryOption === "pickup" && (
            <div className="input-group">
              <label
                className={
                  pickupLocation === "вул. Поштова, 1" ? "selected" : ""
                }
              >
                <input
                  type="radio"
                  value="вул. Поштова, 1"
                  checked={pickupLocation === "вул. Поштова, 1"}
                  onChange={handlePickupLocationChange}
                />
                Адреса 1: вул. Поштова, 1
              </label>
              <label
                className={
                  pickupLocation === "просп. Гагаріна, 2" ? "selected" : ""
                }
              >
                <input
                  type="radio"
                  value="просп. Гагаріна, 2"
                  checked={pickupLocation === "просп. Гагаріна, 2"}
                  onChange={handlePickupLocationChange}
                />
                Адреса 2: просп. Гагаріна, 2
              </label>
              {errors.pickupLocation && (
                <span className="error-message">{errors.pickupLocation}</span>
              )}
            </div>
          )}
        </div>
        <div className="create_cake_form_design">
          <input
            type="text"
            className="input"
            placeholder="На скільки персон торт?"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
          />
          {errors.numPeople && (
            <span className="error-message">{errors.numPeople}</span>
          )}
          <input
            type="text"
            className="input"
            placeholder="Напис на торті"
            value={cakeMessage}
            onChange={(e) => setCakeMessage(e.target.value)}
          />
          {errors.cakeMessage && (
            <span className="error-message">{errors.cakeMessage}</span>
          )}
          <input
            type="text"
            className="input input_large"
            placeholder="Опишіть ваші побажання"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
          />
          {errors.wish && <span className="error-message">{errors.wish}</span>}
          <input
            type="text"
            className="input"
            placeholder="Бажаний час для дзвінка"
            value={preferredCallTime}
            onChange={(e) => setPreferredCallTime(e.target.value)}
          />
          {errors.preferredCallTime && (
            <span className="error-message">{errors.preferredCallTime}</span>
          )}
        </div>
      </div>
      <button
        className="how-it-works-button"
        onClick={() => setShowHowItWorksModal(true)}
      >
        Як це працює?
      </button>
      <button type="submit" className="submit-button" onClick={handleSubmit}>
        Відправити
      </button>

      <HowItWorksModal
        show={showHowItWorksModal}
        handleClose={() => setShowHowItWorksModal(false)}
      />
    </>
  );
};

export default CreateCakeForm;
