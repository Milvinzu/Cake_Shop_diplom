import { useTranslation } from "react-i18next";

import "../scss/components/_footer.scss";

import MapWithGeoZone from "./GeoZoneMap";

import FiPhone from "../assets/img/Footer/phone.svg";
import FiMail from "../assets/img/Footer/email.svg";
import FiMapPin from "../assets/img/Footer/map-point.svg";
import FiTruck from "../assets/img/Footer/delivery.svg";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="wave"></div>
      <div className="footer-container">
        <div className="footer-info">
          <div className="footer-info-contact">
            <h3>{t("Contact information")}</h3>
            <p>
              <img src={FiPhone} alt="Phone" /> {t("PartnershipPhone")}
            </p>
            <p>
              <img src={FiMail} alt="Email" /> Email: cakeshop@gmail.com
            </p>
          </div>

          <div className="footer-info-self-delivery">
            <h3>{t("Pickup addresses")}</h3>
            <p>
              <img src={FiMapPin} alt="Map Pin" /> {t("FirstPickup")}
            </p>
            <p>
              <img src={FiMapPin} alt="Map Pin" /> {t("SecondPickup")}
            </p>
          </div>

          <div className="footer-info-delivery">
            <h3>{t("Delivery information")}</h3>
            <p>
              <img src={FiTruck} alt="Truck" /> {t("Delivery is carried")}
            </p>
          </div>
        </div>
        <div className="footer-map">
          <h3>{t("Geo-zone")}</h3>
          <MapWithGeoZone />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
