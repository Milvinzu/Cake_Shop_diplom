import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUser } from "../hooks/use-auth";

import History from "../assets/img/Account/history.svg";
import Settings from "../assets/img/Account/edit_new.svg";
import LogOut from "../assets/img/Account/log-out.svg";
import Management from "../assets/img/Account/management.svg";
import Cake from "../assets/img/Account/cake-icon.svg";

import OrderHistory from "./OrderHistory";
import OrderCustomCake from "./OrderCustomCake";

import "../scss/components/_accountInfo.scss";
import { logout } from "../redux/slices/User/userSlice";
import { selectUser } from "../redux/slices/User/userSelectors";
import { updateUser } from "../redux/slices/User/userAsyncActions";
import { useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";

const PersonalData = () => {
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  const handleChange = (e) => {
    if (e.target.name === "phoneNumber") {
      const value = e.target.value;
      if (
        (value.length > 4 || value.slice(0, 4) === "+380") &&
        value.length <= 13
      ) {
        setFormData({ ...formData, [e.target.name]: value });
      } else if (value.length > 13) {
        setFormData({ ...formData, [e.target.name]: value.slice(0, 13) });
      } else {
        setFormData({ ...formData, [e.target.name]: "+380" });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^(\+38)?0[3-9][0-9]{8}$/;

    if (
      emailPattern.test(formData.email) &&
      (phonePattern.test(formData.phoneNumber) ||
        formData.phoneNumber === "+380")
    ) {
      if (formData.phoneNumber !== "+380") {
        dispatch(
          updateUser({
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          })
        );
        setMessage(t("Data saved successfully"));
        setMessageType("success-reg-message");
      } else {
        dispatch(
          updateUser({
            fullName: formData.fullName,
            email: formData.email,
          })
        );
        setMessage(t("Data saved successfully"));
        setMessageType("success-reg-message");
      }
    } else {
      if (!emailPattern.test(formData.email)) {
        setMessage(t("Invalid email format"));
        setMessageType("error-message");
      }
      if (
        !phonePattern.test(formData.phoneNumber) &&
        formData.phoneNumber !== "+380"
      ) {
        setMessage(
          t(
            "Invalid phone number format. It should be a Ukrainian phone number"
          )
        );
        setMessageType("error-message");
      }
    }
  };

  return (
    <>
      <div className="account-info-title">
        <h4>{t("Personal data")}</h4>
      </div>
      {message && <p className={messageType}>{message}</p>}
      <div className="account-info-controls">
        <input
          type="text"
          name="fullName"
          placeholder={t("Last name and first name")}
          className="account-info-controls-input"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="account-info-controls-input"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder={t("Mobile phone number")}
          className="account-info-controls-input"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <button className="login-form-btn btn" onClick={handleSubmit}>
          {t("Save changes")}
        </button>
      </div>
    </>
  );
};

const AccountInfo: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [info, setInfo] = useState<JSX.Element | null>(<PersonalData />);
  const [activeButton, setActiveButton] = useState<string>("personal");
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  const handleLogout = () => {
    dispatch(logout());
  };

  const showPersonalData = () => {
    setInfo(<PersonalData />);
    setActiveButton("personal");
  };

  const showOrderHistory = () => {
    setInfo(<OrderHistory />);
    setActiveButton("history");
  };

  const showCustomCake = () => {
    setInfo(<OrderCustomCake />);
    setActiveButton("CustomCake");
  };

  const goToManagementPanel = () => {
    navigate("/management");
  };

  return (
    <div className="account-page">
      <div className="content">
        <div className="menu">
          <button
            onClick={showPersonalData}
            className={`menu-btn btn ${
              activeButton === "personal" ? "active" : ""
            }`}
          >
            <img src={Settings} alt="User Icon" className="icon" />{" "}
            {t("Personal data")}
          </button>
          <button
            onClick={showOrderHistory}
            className={`menu-btn btn ${
              activeButton === "history" ? "active" : ""
            }`}
          >
            <img src={History} alt="History Icon" className="icon" />{" "}
            {t("Order history")}
          </button>
          <button
            onClick={showCustomCake}
            className={`menu-btn btn ${
              activeButton === "CustomCake" ? "active" : ""
            }`}
          >
            <img src={Cake} alt="User Icon" className="icon" /> Торти за власним
            дизайном
          </button>
          {isAdmin && (
            <button
              onClick={goToManagementPanel}
              className={`menu-btn btn ${
                activeButton === "management" ? "active" : ""
              }`}
            >
              <img src={Management} alt="Management Icon" className="icon" />{" "}
              {t("Management panel")}
            </button>
          )}
          <button onClick={handleLogout} className="menu-btn btn">
            <img src={LogOut} alt="Logout Icon" className="icon" />{" "}
            {t("Log out")}
          </button>
        </div>
        <div className="account-info">{info}</div>
      </div>
    </div>
  );
};

export default AccountInfo;
