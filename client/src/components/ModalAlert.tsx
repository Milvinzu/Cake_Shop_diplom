import React from "react";
import "../scss/components/_modal.scss";

interface ModalAlertProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  show,
  handleClose,
  children,
}) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
};

export default ModalAlert;
