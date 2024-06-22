import { createSelector } from "@reduxjs/toolkit";
import { CartState, Product } from "./types";

export const selectCartItems = (state: { Cart: CartState }) => state.Cart.items;

export const selectItemQuantity = (uniqueKey: string) =>
  createSelector([selectCartItems], (items) => {
    const item = items.find((item) => item.uniqueKey === uniqueKey);
    return item ? item.quantity : 0;
  });

export const selectItemPrice = (uniqueKey: string) =>
  createSelector([selectCartItems], (items) => {
    const item = items.find((item) => item.uniqueKey === uniqueKey);
    return item ? item.price * item.quantity : 0;
  });

export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items: Product[]) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)
);
