import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { addToCart } from "../../redux/slices/Cart/cartSlices";
import { Product } from "../../redux/slices/Product/types";
import { fetchTastesByCakeId } from "../../redux/slices/flavorsSlice";
import "../../scss/components/ProductDetail/_cakeDetail.scss";

interface CakeDetailProps {
  product: Product;
}

const CakeDetail: React.FC<CakeDetailProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const flavors = useSelector((state: RootState) => state.flavors.entities);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [chocolateWords, setChocolateWords] = useState<string>(" ");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

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
    if (product) {
      dispatch(fetchTastesByCakeId(product._id));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (flavors.length > 0) {
      setSelectedFlavor(flavors[0].name);
    }
    if (product) {
      let weightArray: string[];
      if (typeof product.weight === "string") {
        weightArray = product.weight.split(",").map((w) => w.trim());
      } else {
        weightArray = product.weight;
      }
      if (product && product.weight) {
        setSelectedWeight(weightArray[0]);
      }
      setPrice(product.price);

      if (product.img instanceof File) {
        const fileUrl = URL.createObjectURL(product.img);
        setImgSrc(fileUrl);
        return () => URL.revokeObjectURL(fileUrl);
      } else {
        setImgSrc(product.img);
      }
    }
  }, [flavors, product]);

  useEffect(() => {
    console.log("Product:", product);
  }, [product]);

  const handleFlavorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlavor(event.target.value);
  };

  const handleChocolateWordsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChocolateWords(event.target.value);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeight(event.target.value);
    setPrice(calculatePrice(event.target.value));
  };

  const calculatePrice = (weight: string) => {
    let baseWeight: string;
    if (typeof product.weight === "string") {
      baseWeight = product.weight.split(",")[0].trim();
    } else {
      baseWeight = product.weight[0];
    }
    const basePrice = product.price;

    const selectedWeightInGrams =
      parseFloat(weight.split("/")[0].replace(",", ".")) * 1000;
    const baseWeightInGrams =
      parseFloat(baseWeight.split(" ")[0].replace(",", ".")) * 1000;

    if (selectedWeightInGrams <= baseWeightInGrams) {
      return basePrice;
    } else {
      const extraWeight = selectedWeightInGrams - baseWeightInGrams;
      const extraPrice = (extraWeight * basePrice) / baseWeightInGrams;
      const discount = Math.floor(extraWeight / 100) * 10;
      const finalPrice = basePrice + extraPrice - discount;

      return finalPrice;
    }
  };

  const selectedFlavorDetails = flavors.find(
    (flavor) => flavor.name === selectedFlavor
  );

  const handleAddToCart = () => {
    if (product && selectedFlavorDetails) {
      const uniqueKey = `${product._id}-${selectedFlavorDetails._id}-${selectedWeight}-${chocolateWords}`;
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          flavorId: selectedFlavorDetails._id,
          flavorName: selectedFlavorDetails.name,
          chocolateWords: chocolateWords,
          photo: imgSrc,
          price: price,
          weight: selectedWeight,
          category: "Cake",
          uniqueKey: uniqueKey,
          quantity: 1,
        })
      );
    }
  };

  const renderDescription = (description: string) => {
    const localizedDescription = parseLocalizedString(description, currentLang);
    const lines = localizedDescription.split("\\n");
    let isNewParagraph = false;
    let isFirstLineInParagraph = true;
    let content;

    return lines.map((line, index) => {
      if (line === "") {
        isNewParagraph = true;
        isFirstLineInParagraph = true;
        return <br key={index} />;
      }

      if (isNewParagraph && isFirstLineInParagraph) {
        content = line;
        isFirstLineInParagraph = false;
      } else {
        content = `- ${line}`;
      }

      return (
        <React.Fragment key={index}>
          {content}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="product-detail">
      <div className="product-detail-img">
        <img
          src={imgSrc}
          alt={parseLocalizedString(product.name, currentLang)}
        />
      </div>
      <div className="product-detail-info">
        <h2>{parseLocalizedString(product.name, currentLang)}</h2>
        <p>{renderDescription(product.description)}</p>
        <label htmlFor="flavor-select">{t("Choose a flavor")}:</label>
        <select
          id="flavor-select"
          className="input"
          value={selectedFlavor}
          onChange={handleFlavorChange}
        >
          {flavors &&
            flavors.map((flavor) => (
              <option
                key={parseLocalizedString(flavor.name, currentLang)}
                value={parseLocalizedString(flavor.name, currentLang)}
              >
                {parseLocalizedString(flavor.name, currentLang)}
              </option>
            ))}
        </select>
        <label htmlFor="weight-select">{t("Choose a weight")}:</label>
        <select
          id="weight-select"
          className="input"
          value={selectedWeight}
          onChange={handleWeightChange}
        >
          {product &&
            product.weight &&
            (typeof product.weight === "string"
              ? parseLocalizedString(product.weight, currentLang)
                  .split("/")
                  .map((weight, index) => (
                    <option key={index} value={weight}>
                      {weight}
                    </option>
                  ))
              : product.weight.map((weight, index) => (
                  <option key={index} value={weight}>
                    {parseLocalizedString(weight, currentLang)}
                  </option>
                )))}
        </select>
        {selectedFlavorDetails && (
          <div className="flavor-details">
            <h3>
              {parseLocalizedString(selectedFlavorDetails.name, currentLang)}
            </h3>
            <p>{renderDescription(selectedFlavorDetails.description)}</p>
            <label htmlFor="chocolate-words-input">
              Приблизний вигляд смаку:
            </label>
            <img
              src={selectedFlavorDetails.img}
              alt={parseLocalizedString(
                selectedFlavorDetails.name,
                currentLang
              )}
            />
          </div>
        )}
        <div>
          <label htmlFor="chocolate-words-input">
            {t("Words in chocolate")}:
          </label>
          <input
            type="text"
            id="chocolate-words-input"
            className="input"
            placeholder="З днем народження"
            value={chocolateWords}
            onChange={handleChocolateWordsChange}
          />
        </div>
        <p>
          {t("Price")}: {price} {t("UAH")}
        </p>
        <button onClick={handleAddToCart}>{t("Add to cart")}</button>
      </div>
    </div>
  );
};

export default CakeDetail;
