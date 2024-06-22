import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../scss/components/_infoPanel.scss";

const InfoPanel: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const items = [
    {
      title: t("Ways to receive an order"),
      content: t("WTRAOtext"),
    },
    {
      title: t("Terms of execution of orders"),
      content: t("TOEOFtext"),
    },
    {
      title: t("Payment for orders"),
      content: t("PFOtext"),
    },
    {
      title: t("Terms and conditions of storage"),
      content: t("TACOStext"),
    },
  ];

  return (
    <div className="info-panel">
      <h1 className="info-panel__title">{t("FAQ")}</h1>
      {items.map((item, index) => (
        <div
          key={index}
          className={`info-panel__item ${
            openIndex === index ? "info-panel__item--open" : ""
          }`}
        >
          <button
            className="info-panel__button"
            onClick={() => handleClick(index)}
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div className="info-panel__content">
              {item.content.split("\n").map((line, i) => (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: line.replace("\n\n", "\n<br />\n"),
                  }}
                ></p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InfoPanel;
