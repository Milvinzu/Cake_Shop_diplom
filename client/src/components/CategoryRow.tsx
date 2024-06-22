import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ImageWithLoading from "./ImageWithLoading";

import "../scss/components/_categoryRow.scss";

import Cake from "../assets/img/Category/cake_category.png";
import Eclair from "../assets/img/Category/eclair.png";
import Marshmallow from "../assets/img/Category/zefir-category.png";
import Macaron from "../assets/img/Category/macaron.png";
import Tart from "../assets/img/Category/tarts_cat01.png";
import Pastry from "../assets/img/Category/croisant_cat01.png";

const CategoryRow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="category">
      <div className="category-item">
        <Link to="/category/Cake" className="category-item-link">
          <ImageWithLoading src={Cake} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Cakes")}</h3>
      </div>
      <div className="category-item">
        <Link to="/category/Eclair" className="category-item-link">
          <ImageWithLoading src={Eclair} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Eclairs")}</h3>
      </div>
      <div className="category-item">
        <Link to="/category/Marshmallow" className="category-item-link">
          <ImageWithLoading src={Marshmallow} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Marshmallows")}</h3>
      </div>
      <div className="category-item">
        <Link to="/category/Macaron" className="category-item-link">
          <ImageWithLoading src={Macaron} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Macaron")}</h3>
      </div>
      <div className="category-item">
        <Link to="/category/Tart" className="category-item-link">
          <ImageWithLoading src={Tart} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Tarts")}</h3>
      </div>
      <div className="category-item">
        <Link to="/category/Pastry" className="category-item-link">
          <ImageWithLoading src={Pastry} alt="" />
        </Link>
        <h3 className="category-item-title">{t("Pastries")}</h3>
      </div>
    </div>
  );
};

export default CategoryRow;
