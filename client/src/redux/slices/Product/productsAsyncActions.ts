import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config";
import { Product, RegularProduct, ShablonCake, Taste } from "./types";

export const fetchTopProducts = createAsyncThunk<Product[]>(
  "products/fetchTopProducts",
  async () => {
    const response = await axios.get<Product[]>(
      "https://65ee2cc408706c584d9b2477.mockapi.io/Cake"
    );
    return response.data;
  }
);

export const fetchProductsByCategory = createAsyncThunk<Product[], string>(
  "products/fetchProductsByCategory",
  async (categoryName: string) => {
    const response = await axios.get<RegularProduct[]>(
      `${config.API_BASE_URL}/regularbakery/category/${categoryName}`
    );
    return response.data.map((product) => ({
      _id: product._id!,
      img: product.img,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      weight: product.weight,
      category: product.category,
    }));
  }
);

export const fetchCakeProducts = createAsyncThunk<Product[]>(
  "products/fetchCakeProducts",
  async () => {
    const response = await axios.get<Product[]>(
      `${config.API_BASE_URL}/shabloncake`
    );
    return response.data.map((product) => ({
      _id: product._id!,
      img: product.img,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      weight: product.weight,
      category: "Cake",
    }));
  }
);

export const fetchCakeById = createAsyncThunk<Product, string>(
  "products/fetchCakeById",
  async (id: string) => {
    const response = await axios.get<Product>(
      `${config.API_BASE_URL}/shabloncake/${id}`
    );
    const product = response.data;

    return {
      _id: product._id!,
      img: product.img,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      weight: product.weight,
      category: "Cake",
    };
  }
);

export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (id: string) => {
    const response = await axios.get<RegularProduct>(
      `${config.API_BASE_URL}/regularbakery/${id}`
    );
    const product = response.data;
    return {
      _id: product._id!,
      img: product.img,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      weight: [product.weight],
      category: product.category,
    };
  }
);

export const addProduct = createAsyncThunk<RegularProduct, RegularProduct>(
  "products/addProduct",
  async (product: RegularProduct, thunkAPI) => {
    const regularProduct: RegularProduct = {
      category: product.category,
      name: product.name,
      description: product.description,
      weight: product.weight,
      price: product.price,
      img: null,
    };

    const response = await axios.post<RegularProduct>(
      `${config.API_BASE_URL}/regularbakery`,
      regularProduct
    );

    const addedProduct = response.data;

    if (addedProduct._id && product.img) {
      const formData = new FormData();
      formData.append("bakeryId", addedProduct._id);
      formData.append("bakery", product.img);

      await axios.post(`${config.API_BASE_URL}/upload/bakery`, formData);
    }

    return addedProduct;
  }
);

export const updateProduct = createAsyncThunk<Product, Product>(
  "products/updateProduct",
  async (product: Product) => {
    const response = await axios.put<Product>(
      `${config.API_BASE_URL}/regularbakery/${product._id}`,
      product
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (_id: string) => {
    await axios.delete(`${config.API_BASE_URL}/regularbakery/${_id}`);
    return _id;
  }
);

export const addCake = createAsyncThunk<ShablonCake, { cake: ShablonCake }>(
  "products/addCake",
  async ({ cake }) => {
    const { img, ...cakeWithoutImg } = cake;
    const response = await axios.post<ShablonCake>(
      `${config.API_BASE_URL}/shabloncake`,
      cakeWithoutImg
    );
    const newCake = response.data;

    console.log(newCake._id);
    console.log(img);
    if (img) {
      const formData = new FormData();
      formData.append("cakeId", newCake._id);
      formData.append("cake", img);
      await axios.post(`${config.API_BASE_URL}/upload/cake`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return newCake;
  }
);

export const addTaste = createAsyncThunk<Taste, { taste: Taste }>(
  "products/addTaste",
  async ({ taste }) => {
    const { img, ...tasteWithoutImg } = taste;
    const response = await axios.post<Taste>(
      `${config.API_BASE_URL}/taste`,
      tasteWithoutImg
    );

    const newTaste = response.data;

    if (img) {
      const formData = new FormData();
      formData.append("tasteId", newTaste._id);
      formData.append("cakeId", taste.cakeId);
      formData.append("tastes", img);
      await axios.post(`${config.API_BASE_URL}/upload/tastes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return response.data;
  }
);

export const updateCake = createAsyncThunk<
  ShablonCake,
  { _id: string; cake: Product }
>("products/updateCake", async ({ _id, cake }) => {
  const response = await axios.put<ShablonCake>(
    `${config.API_BASE_URL}/shabloncake/${_id}`,
    cake
  );
  return response.data;
});

export const deleteCake = createAsyncThunk<string, string>(
  "products/deleteCake",
  async (id: string) => {
    await axios.delete(`${config.API_BASE_URL}/shabloncake/${id}`);
    return id;
  }
);
