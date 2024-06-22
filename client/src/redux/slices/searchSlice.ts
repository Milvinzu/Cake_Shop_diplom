import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import config from "config";
import { Product } from "../slices/Product/types"; // Adjust the import path as necessary

interface SearchState {
  products: Product[];
  filteredProducts: Product[];
  singleProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  products: [],
  filteredProducts: [],
  singleProduct: null,
  status: "idle",
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    getProductsStart(state) {
      state.status = "loading";
    },
    getProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.status = "succeeded";
      state.products = action.payload;
      state.filteredProducts = action.payload; // Initialize filteredProducts with all products
    },
    getProductsFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    searchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.filteredProducts = action.payload;
    },
    clearProductSearch(state) {
      state.filteredProducts = state.products;
    },
    getProductStart(state) {
      state.status = "loading";
    },
    getProductSuccess(state, action: PayloadAction<Product>) {
      state.status = "succeeded";
      state.singleProduct = action.payload;
    },
    getProductFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  searchProductsSuccess,
  clearProductSearch,
  getProductStart,
  getProductSuccess,
  getProductFailure,
} = searchSlice.actions;

export const fetchAllProducts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getProductsStart());
    const responseRegularBakery = await fetch(
      `${config.API_BASE_URL}/regularbakery`
    );
    const responseShablonCake = await fetch(
      `${config.API_BASE_URL}/shabloncake`
    );

    const dataRegularBakery = await responseRegularBakery.json();
    const dataShablonCake = await responseShablonCake.json();

    // Add category "Cake" to each product in dataShablonCake
    const processedShablonCake = dataShablonCake.map((product: Product) => ({
      ...product,
      category: "Cake",
    }));

    const combinedProducts = [...dataRegularBakery, ...processedShablonCake];
    dispatch(getProductsSuccess(combinedProducts));
  } catch (err) {
    dispatch(getProductsFailure(err.toString()));
  }
};

export const searchProducts =
  (searchTerm: string): AppThunk =>
  (dispatch, getState) => {
    const allProducts = getState().search.products;
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(searchProductsSuccess(filteredProducts));
  };

export const fetchUnknownProductById =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(getProductStart());
      const state = getState().search;
      console.log(id);
      const product = state.products.find((product) => product._id === id);
      console.log(product.category);
      if (product) {
        const endpoint =
          product.category === "Cake" ? "shabloncake" : "regularbakery";
        const response = await fetch(
          `${config.API_BASE_URL}/${endpoint}/${id}`
        );
        const data = await response.json();
        dispatch(getProductSuccess(data));
      } else {
        throw new Error("Product not found");
      }
    } catch (err) {
      dispatch(getProductFailure(err.toString()));
    }
  };

export default searchSlice.reducer;
