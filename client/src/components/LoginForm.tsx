import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../redux/slices/User/userAsyncActions";
import { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";

import "../scss/components/_login.scss";

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSuccessMessage(""); // Reset success message on toggle
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("Будь ласка, заповніть всі поля"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("Неправильний формат email"));
      return;
    }
    try {
      const resp = await dispatch(
        loginUser({ email: email, password: password })
      );
      if (!resp.payload) {
        setError(t("Не правильний email або пароль"));
      } else {
        navigate("/account");
      }
    } catch (err) {
      setError(t("Не правильний email або пароль"));
      if (err.message) {
        setError(err.message);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError(t("Будь ласка, заповніть всі поля"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("Неправильний формат email"));
      return;
    }
    if (!validatePassword(password)) {
      setError(t("Пароль не може бути менше 6 символів"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("Паролі не співпадають"));
      return;
    }
    try {
      await dispatch(
        registerUser({
          email: email,
          fullName: "",
          password: password,
          phoneNumber: "",
        })
      );
      setIsRegistering(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccessMessage(t("Реєстрація пройшла успішно!")); // Set success message
    } catch (err) {
      setError(t("Не вдалося зареєструватися"));
      if (err.message) {
        setError(err.message);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-form">
      <div className="login-form-title">
        {isRegistering ? t("Registration") : t("Log in")} <br />{" "}
        {t("to your personal account")}
      </div>
      <input
        type="email"
        className="login-form-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="login-form-input"
        placeholder={t("Password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegistering && (
        <input
          type="password"
          className="login-form-input"
          placeholder={t("Repeat the password")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-reg-message">{successMessage}</div>
      )}
      <button
        className="btn login-form-btn"
        onClick={isRegistering ? handleRegister : handleLogin}
      >
        {isRegistering ? t("Register") : t("Log in")}
      </button>
      <div className="login-register-toggle" onClick={toggleRegistration}>
        {isRegistering ? t("Log in to your account") : t("Register")}
      </div>
      {!isRegistering && (
        <button
          className="btn forgot-password-btn"
          onClick={handleForgotPassword}
        >
          Забули пароль?
        </button>
      )}
    </div>
  );
};

export default LoginForm;
