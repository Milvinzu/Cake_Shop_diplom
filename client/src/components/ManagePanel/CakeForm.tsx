import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useTranslation } from "react-i18next";
import {
  addCake,
  addTaste,
} from "../../redux/slices/Product/productsAsyncActions";
import { ShablonCake, Taste } from "../../redux/slices/Product/types";
import config from "config";
import axios from "axios";

import "../../scss/components/ManagePanel/_cakeManagement.scss";

const CakeForm: React.FC = () => {
  const [cakeName, setCakeName] = useState("");
  const [cakeDescription, setCakeDescription] = useState("");
  const [cakePrice, setCakePrice] = useState("");
  const [cakeWeight, setCakeWeight] = useState("");
  const [cakeImg, setCakeImg] = useState<File | null>(null);
  const { t } = useTranslation();
  const [tastes, setTastes] = useState<
    {
      name: string;
      nameEng: string;
      description: string;
      descriptionEng: string;
      img: File | null;
    }[]
  >([
    { name: "", nameEng: "", description: "", descriptionEng: "", img: null },
  ]);
  const [tasteCount, setTasteCount] = useState(1);

  const dispatch: AppDispatch = useDispatch();

  const translate = async (text: string) => {
    const result = await axios.post(`${config.API_BASE_URL}/translate`, {
      text,
      sourceLang: "UK",
      targetLang: "EN-US",
    });
    return result.data.translatedText;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cakeNameEng = await translate(cakeName);
    const cakeDescriptionEng = await translate(cakeDescription);
    const cakeWeightEng = await translate(cakeWeight);

    const cake: ShablonCake = {
      name: `${cakeName} %eng% ${cakeNameEng}`,
      description: `${cakeDescription} %eng% ${cakeDescriptionEng}`,
      price: Number(cakePrice),
      weight: `${cakeWeight} %eng% ${cakeWeightEng}`,
      img: cakeImg,
    };

    const addedCake = await dispatch(addCake({ cake }));
    if (addCake.fulfilled.match(addedCake)) {
      const cakeId = addedCake.payload._id;
      for (const taste of tastes) {
        const tasteNameEng = await translate(taste.name);
        const tasteDescriptionEng = await translate(taste.description);
        const newTaste: Taste = {
          cakeId,
          name: `${taste.name} %eng% ${tasteNameEng}`,
          description: `${taste.description} %eng% ${tasteDescriptionEng}`,
          img: taste.img,
        };

        await dispatch(addTaste({ taste: newTaste }));
      }
    }
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedTastes = tastes.map((taste, i) =>
        i === index ? { ...taste, img: files[0] } : taste
      );
      setTastes(updatedTastes);
    }
  };

  const handleTasteChange = (index: number, key: string, value: string) => {
    const updatedTastes = tastes.map((taste, i) =>
      i === index ? { ...taste, [key]: value } : taste
    );
    setTastes(updatedTastes);
  };

  const handleTasteCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const count = Number(event.target.value);
    setTasteCount(count);
    setTastes((prevTastes) => {
      const newTastes = [...prevTastes];
      if (count > prevTastes.length) {
        for (let i = prevTastes.length; i < count; i++) {
          newTastes.push({
            name: "",
            nameEng: "",
            description: "",
            descriptionEng: "",
            img: null,
          });
        }
      } else {
        newTastes.length = count;
      }
      return newTastes;
    });
  };

  const handleCakeImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setCakeImg(files[0]);
    }
  };

  return (
    <div>
      <h1>{t["Cake Management"]}</h1>

      <div className="cake_input">
        <input
          type="text"
          value={cakeName}
          className="input input_item"
          placeholder={t("Cake Name")}
          onChange={(e) => setCakeName(e.target.value)}
        />
        <input
          type="text"
          value={cakeDescription}
          className="input input_item"
          placeholder={t("Cake Description")}
          onChange={(e) => setCakeDescription(e.target.value)}
        />
        <input
          type="number"
          value={cakePrice}
          className="input input_item"
          placeholder={t("Cake Price")}
          onChange={(e) => setCakePrice(e.target.value)}
        />
        <input
          type="text"
          value={cakeWeight}
          className="input input_item"
          placeholder={t("Cake Weight")}
          onChange={(e) => setCakeWeight(e.target.value)}
        />
        <label>
          {t("Cake Photo")}
          <input
            type="file"
            accept="image/*"
            className="input input_item"
            onChange={handleCakeImgChange}
          />
        </label>
      </div>
      <div className="taste_count_input">
        <input
          type="number"
          value={tasteCount}
          className="input input_item"
          placeholder={t("Number of Tastes")}
          onChange={handleTasteCountChange}
          min="1"
        />
      </div>
      {tastes.map((taste, index) => (
        <div key={index} className="taste_input">
          <input
            type="text"
            value={taste.name}
            className="input input_item"
            placeholder={`${t("Taste Name")} ${index + 1}`}
            onChange={(e) => handleTasteChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            value={taste.description}
            className="input input_item"
            placeholder={`${t("Taste Description")} ${index + 1}`}
            onChange={(e) =>
              handleTasteChange(index, "description", e.target.value)
            }
          />
          <label>
            {`${t("Taste Photo")} ${index + 1}`}
            <input
              type="file"
              accept="image/*"
              className="input input_item"
              onChange={(e) => handleFileChange(index, e)}
            />
          </label>
        </div>
      ))}
      <button className="cake_add_btn" type="submit" onClick={handleFormSubmit}>
        {t("Add Cake and Tastes")}
      </button>
    </div>
  );
};

export default CakeForm;
