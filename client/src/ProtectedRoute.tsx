import React, { useState, useEffect } from "react";
import ModalAlert from "./components/ModalAlert";
import { useNavigate } from "react-router-dom";
import { useUser } from "./hooks/use-auth";

export const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);

  return isLoggedIn && isAdmin ? children : null;
};

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};

export const ProtectedRouteAlert: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, [isLoggedIn]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/Login");
  };

  if (!isLoggedIn) {
    return (
      <ModalAlert show={showModal} handleClose={handleCloseModal}>
        <div className="alert">
          <p>Щоб здійснити цю дію, ввійдіть в аккаунт</p>
          <button onClick={() => navigate("/Login")} className="btn alert-btn">
            Login
          </button>
        </div>
      </ModalAlert>
    );
  }

  return <>{children}</>;
};
