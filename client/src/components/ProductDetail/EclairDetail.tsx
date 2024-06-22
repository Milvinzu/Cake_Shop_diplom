import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../../redux/slices/Cart/cartSlices";
import { Product } from "../../redux/slices/Product/types";
import "../../scss/components/ProductDetail/_EclairDetail.scss";

interface EclairDetailProps {
  product: Product;
}

const EclairDetail: React.FC<EclairDetailProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [imgSrc, setImgSrc] = useState<string>("");

  const currentLang = i18n.language;
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
  let weightArray: string[] = [];
  if (typeof product.weight === "string") {
    weightArray = parseLocalizedString(product.weight, currentLang).split(",");
  }

  useEffect(() => {
    if (product.img instanceof File) {
      const fileUrl = URL.createObjectURL(product.img);
      setImgSrc(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setImgSrc(product.img);
    }
  }, [product.img]);

  const addToCart = () => {
    const { _id, name, price } = product;

    const uniqueKey = `${_id}-${weightArray[1]}`;
    dispatch(
      addToCartAction({
        _id,
        name: name,
        flavorId: null,
        flavorName: "",
        chocolateWords: "",
        photo: imgSrc,
        price,
        weight: weightArray[0],
        category: product.category,
        quantity: 1,
        uniqueKey,
      })
    );
  };

  return (
    <div className="product-detail">
      <div className="product-detail-img">
        <img src={imgSrc} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <div className="product-detail-info-title">
          <h2>{parseLocalizedString(product.name, currentLang)}</h2>
        </div>
        <div className="product-detail-info-attribute">
          <p>
            <span>{t("Weight of the set")}:</span> {weightArray[0]}
          </p>
          <p>
            <span>{t("Weight of one eclair")}:</span> {weightArray[1]}
          </p>
          <p>
            <span>{t("The size of one eclair")}:</span> {weightArray[2]}
          </p>
        </div>
        <div className="product-detail-info-description">
          {parseLocalizedString(product.description, currentLang)
            .split(":")
            .map((part, index) =>
              index === 0 ? (
                <span key={index}>{part}:</span>
              ) : (
                <p key={index}>{part}</p>
              )
            )}
        </div>
        <div className="product-detail-info-buy">
          <p>
            {t("Price")}: {product.price} {t("UAH")}
          </p>
          <button onClick={addToCart}>{t("Add to cart")}</button>
        </div>
      </div>
    </div>
  );
};

export default EclairDetail;
