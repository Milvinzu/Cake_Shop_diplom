import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  requestPasswordReset,
  verifyPasswordResetToken,
  resetPassword,
} from "../redux/slices/User/userAsyncActions";
import { AppDispatch } from "../redux/store";

import "../scss/components/_login.scss";

const RestorePasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const response = await dispatch(requestPasswordReset(email)).unwrap();
      setSuccessMessage(response.message);
      setStep(2);
    } catch (err) {
      setError(err.message || t("Щось пішло не так"));
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const response = await dispatch(verifyPasswordResetToken(token)).unwrap();
      setSuccessMessage(response.message);
      setStep(3);
    } catch (err) {
      setError(err.message || t("Неправильний або прострочений токен"));
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (newPassword !== confirmNewPassword) {
      setError(t("Паролі не співпадають"));
      return;
    }
    try {
      const response = await dispatch(
        resetPassword({ token, newPassword })
      ).unwrap();
      setSuccessMessage(response.message);
      setStep(4);
      navigate("/Login");
    } catch (err) {
      setError(err.message || t("Не вдалося змінити пароль"));
    }
  };

  return (
    <div className="login-form">
      <div className="login-form-title">{t("Відновлення паролю")}</div>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            className="login-form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn login-form-btn">
            {t("Відправити")}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTokenSubmit}>
          <input
            type="text"
            className="login-form-input"
            placeholder={t("Введіть токен")}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button type="submit" className="btn login-form-btn">
            {t("Підтвердити")}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordResetSubmit}>
          <input
            type="password"
            className="login-form-input"
            placeholder={t("Новий пароль")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="login-form-input"
            placeholder={t("Повторіть новий пароль")}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button type="submit" className="btn login-form-btn">
            {t("Змінити пароль")}
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="success-reg-message">{t("Пароль змінено успішно")}</div>
      )}

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-reg-message">{successMessage}</div>
      )}
    </div>
  );
};

export default RestorePasswordForm;
