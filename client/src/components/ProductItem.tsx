import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../scss/components/_ProductItem.scss";

type ProductItemProps = {
  photo: string | File;
  price: number;
  name: string;
  id: string;
  category?: string;
};

const ProductItem: React.FC<ProductItemProps> = ({
  photo,
  price,
  name,
  id,
  category,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const parseLocalizedString = (str: string | undefined, lang: string) => {
    if (typeof str !== "string") {
      return "";
    }
    if (str.includes("%eng%")) {
      const parts = str.split("%eng%");
      return lang === "en" && parts[1] ? parts[1] : parts[0];
    } else {
      return str;
    }
  };

  const currentLang = i18n.language;

  useEffect(() => {
    if (typeof photo === "string") {
      setPhotoUrl(photo);
    } else if (photo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(photo);
    }
  }, [photo]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLinkClick = () => {
    if (category === "Search Results") {
      navigate(`/SearchResults/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div
      className="product-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleLinkClick}>
        {photoUrl && (
          <img src={photoUrl} alt={parseLocalizedString(name, currentLang)} />
        )}
      </div>

      <div
        className="product-item-overlay"
        style={{
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        <div className="product-item-overlay-buyBtn">
          <span onClick={handleLinkClick}>{t("ToOrder")}</span>
        </div>
      </div>

      <div className="product-details">
        <p className="product-details-name">
          {parseLocalizedString(name, currentLang)}
        </p>
        <p className="product-details-price-weight">
          <span>
            {price} {t("UAH")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
