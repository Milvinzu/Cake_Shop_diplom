import React from "react";
import Modal from "./ModalAlert";
import "../scss/components/_modal.scss";

interface HowItWorksModalProps {
  show: boolean;
  handleClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="cake_create_info">
        <h2>Як це працює?</h2>
        <p>Ви заповнюєте форму для створення власного дизайну</p>
        <p>
          Менеджер передзвонить Вам у бажаний час для обговорення вашого
          замовлення
        </p>
        <p>
          Після узгодження всіх деталей, заходьте у акаунт у пункт "Торти за
          власним дизайном"
        </p>
        <p>
          Там перевірте опис замовлення та ціну, якщо все вказано правильно
          передсплатіть замовлення
        </p>
        <p>Після чого воно піде у обробку та буде доставлено вчасно!</p>
        <button onClick={handleClose} className="btn alert-btn">
          Зрозуміло
        </button>
      </div>
    </Modal>
  );
};

export default HowItWorksModal;
