import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { registerAdmin } from "../../redux/slices/User/userAsyncActions";

const ProductManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordMismatch(false);
    setPhoneError(false);
    setEmailError(false);

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError(true);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    try {
      await dispatch(
        registerAdmin({ email, password, fullName, phoneNumber, role: "admin" })
      ).unwrap();
      alert("Admin registered successfully");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhoneNumber("");
    } catch (err) {
      setError("Failed to register admin. Please try again.");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Admin Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegisterAdmin}>
        <div>
          <label>Email:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            type="email"
          />
          {emailError && (
            <p style={{ color: "red" }}>Пошта введена не кореткно</p>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            type="password"
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input"
            type="password"
          />
          {passwordMismatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
        </div>
        <div>
          <label>Full Name:</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="input"
            type="tel"
          />
          {phoneError && (
            <p style={{ color: "red" }}>
              Invalid phone number format. Must be +380XXXXXXXXX
            </p>
          )}
        </div>
        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
};

export default ProductManagement;
