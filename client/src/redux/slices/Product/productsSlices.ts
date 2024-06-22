import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ShablonCake, Taste } from "./types";
import {
  fetchTopProducts,
  fetchProductsByCategory,
  fetchCakeProducts,
  addCake,
  addTaste,
  updateCake,
  deleteCake,
} from "./productsAsyncActions";

export interface ProductsState {
  cakes: ShablonCake[];
  tastes: Taste[];
  products: Product[];
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  cakes: [],
  tastes: [],
  products: [],
  loading: "idle",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(
        fetchTopProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = "idle";
          state.products = action.payload;
        }
      )
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch top products";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(
        fetchProductsByCategory.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = "idle";
          state.products = action.payload;
        }
      )
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.error.message || "Failed to fetch products by category";
      })
      .addCase(fetchCakeProducts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(
        fetchCakeProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = "idle";
          state.products = action.payload;
        }
      )
      .addCase(fetchCakeProducts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to perform your action";
      })
      .addCase(
        addCake.fulfilled,
        (state, action: PayloadAction<ShablonCake>) => {
          state.loading = "idle";
          state.cakes = [...state.cakes, action.payload];
        }
      )
      .addCase(addTaste.fulfilled, (state, action: PayloadAction<Taste>) => {
        state.loading = "idle";
        state.tastes = [...state.tastes, action.payload];
      })
      .addCase(updateCake.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(
        updateCake.fulfilled,
        (state, action: PayloadAction<ShablonCake>) => {
          state.loading = "idle";
          const index = state.cakes.findIndex(
            (cake) => cake._id === action.payload._id
          );
          if (index !== -1) {
            state.cakes[index] = action.payload;
          } else {
            state.cakes.push(action.payload);
          }
        }
      )
      .addCase(updateCake.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to update the cake";
      })
      .addCase(deleteCake.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(deleteCake.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = "idle";
        state.cakes = state.cakes.filter((cake) => cake._id !== action.payload);
      })
      .addCase(deleteCake.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to delete the cake";
      });
  },
});

export default productsSlice.reducer;
