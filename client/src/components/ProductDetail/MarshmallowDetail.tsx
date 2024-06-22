import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../../redux/slices/Cart/cartSlices";
import { Product } from "../../redux/slices/Product/types";
import "../../scss/components/ProductDetail/_MarshmallowDetail.scss";

interface MarshmallowDetailProps {
  product: Product;
}

const MarshmallowDetail: React.FC<MarshmallowDetailProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
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
  const [imgSrc, setImgSrc] = useState<string>("");

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
    const { _id, name, price, weight } = product;
    const uniqueKey = `${_id}-${weight[1]}`;
    dispatch(
      addToCartAction({
        _id,
        name: name,
        flavorId: null,
        flavorName: "",
        chocolateWords: "",
        photo: imgSrc,
        price,
        weight: weight[0],
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
        <h2>{parseLocalizedString(product.name, currentLang)}</h2>
        <p>{parseLocalizedString(product.description, currentLang)}</p>
        <p>
          {t("Weight of the set")}:{" "}
          {parseLocalizedString(product.weight.toString(), currentLang)}
        </p>
        <p>
          {t("Price")}: {product.price} {t("UAH")}
        </p>
        <button onClick={addToCart}>{t("Add to cart")}</button>
      </div>
    </div>
  );
};

export default MarshmallowDetail;