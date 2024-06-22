import React, { useState } from "react";
import "../../scss/components/_ProductItem.scss";
import "../../scss/components/_modal.scss";
import { useTranslation } from "react-i18next";

const AdminProductItem = ({
  photo,
  price,
  name,
  id,
  category,
  description,
  weight,
  img,
  onDelete,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      onDelete(id);
    }
  };

  const handleUpdateClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    const updatedProduct = {
      category: event.target.category.value,
      name: event.target.name.value,
      description: event.target.description.value,
      weight: event.target.weight.value,
      price: event.target.price.value,
      img: event.target.img.value,
    };
    onUpdate(id, updatedProduct);
    setShowModal(false);
  };

  return (
    <div
      className="product-item-admin"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <img src={photo} alt={name} />
      </div>

      <div className="product-details">
        <p className="product-details-name">{name}</p>
        <p className="product-details-price-weight">
          <span> {price} грн</span>
        </p>
      </div>

      <div
        className="product-item-overlay"
        style={{
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        <div className="product-item-overlay-deleteBtn">
          <span onClick={handleDeleteClick}>{t("Delete")}</span>
        </div>
        <div className="product-item-overlay-updateBtn">
          <span onClick={handleUpdateClick}>{t("Update")}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal display-block">
          <div className="modal-main">
            <div className="modal-content">
              <span
                className="close"
                onClick={handleModalClose}
                style={{ zIndex: 99999 }}
              >
                ×
              </span>
              <form onSubmit={handleUpdateSubmit}>
                <label>
                  {t("Category")}:
                  <input
                    type="text"
                    name="category"
                    defaultValue={category}
                    required
                  />
                </label>
                <label>
                  {t("Name")}:
                  <input type="text" name="name" defaultValue={name} required />
                </label>
                <label>
                  {t("Description")}:
                  <textarea
                    name="description"
                    defaultValue={description}
                    required
                  />
                </label>
                <label>
                  {t("Weight")}:
                  <input
                    type="text"
                    name="weight"
                    defaultValue={weight}
                    required
                  />
                </label>
                <label>
                  {t("Price")}:
                  <input
                    type="number"
                    name="price"
                    defaultValue={price}
                    required
                  />
                </label>

                <input
                  type="text"
                  name="img"
                  defaultValue={img}
                  style={{ display: "none" }}
                />

                <input type="submit" value={t("Save changes")} />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductItem;
