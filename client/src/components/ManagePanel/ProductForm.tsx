import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slices/Product/productsAsyncActions";
import { AppDispatch } from "../../redux/store";
import axios from "axios";
import config from "config";
import "../../scss/components/ManagePanel/_productForm.scss";

const ProductForm: React.FC = () => {
  const categories = ["Eclair", "Marshmallow", "Macaron", "Tart", "Pastry"];

  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const translate = async (text: string) => {
    const result = await axios.post(`${config.API_BASE_URL}/translate`, {
      text,
      sourceLang: "UK",
      targetLang: "EN-US",
    });
    return result.data.translatedText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleEng = await translate(title);
    const descriptionEng = await translate(description);
    const weightEng = await translate(weight);

    dispatch(
      addProduct({
        _id: null,
        name: title + "%eng%" + titleEng,
        price: Number(price),
        description: description + "%eng%" + descriptionEng,
        weight: weight + "%eng%" + weightEng,
        category,
        img: image,
      })
    );

    // Reset form fields and show success message
    setTitle("");
    setPrice("");
    setDescription("");
    setWeight("");
    setCategory(categories[0]); // Reset to the default category
    setImage(null);
    setSuccessMessage("Product successfully added!");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="input-regulaer-product">
      <input
        type="text"
        placeholder="Title"
        value={title}
        className="input input-item"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        className="input input-item"
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        className="input input-item"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Weight"
        value={weight}
        className="input input-item"
        onChange={(e) => setWeight(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input input-item"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="input input-item"
      />
      <button type="submit" onClick={handleSubmit}>
        Save Product
      </button>

      {successMessage && (
        <p style={{ padding: 0, margin: 0 }} className="success-message">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default ProductForm;
