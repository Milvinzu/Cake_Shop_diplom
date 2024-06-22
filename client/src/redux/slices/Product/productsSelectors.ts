import { RootState } from "../../store";
import { createSelector } from "@reduxjs/toolkit";
import { Product } from "./types";

export const selectProducts = (state: RootState) => state.Products;

export const selectProductEntities = createSelector(
  selectProducts,
  (products) => products.products
);

export const selectProductLoading = createSelector(
  selectProducts,
  (products) => products.loading
);

export const selectProductById = (productId: string) =>
  createSelector(selectProductEntities, (products) =>
    products.find((product) => product._id === productId)
  );
