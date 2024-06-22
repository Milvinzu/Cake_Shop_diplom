import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, CartState } from "./types";
import { createOrder } from "./cartAsyncActions";

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const updateLocalStorage = (items: Product[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const productIndex = state.items.findIndex(
        (item) => item.uniqueKey === action.payload.uniqueKey
      );
      if (productIndex !== -1) {
        state.items[productIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      updateLocalStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productIndex = state.items.findIndex(
        (item) => item.uniqueKey === action.payload
      );
      if (productIndex !== -1) {
        state.items.splice(productIndex, 1);
      }
      updateLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    changeQuantity: (
      state,
      action: PayloadAction<{ uniqueKey: string; quantity: number }>
    ) => {
      const product = state.items.find(
        (item) => item.uniqueKey === action.payload.uniqueKey
      );
      if (product) {
        product.quantity = action.payload.quantity;
      }
      updateLocalStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    });
  },
});

export const { addToCart, removeFromCart, clearCart, changeQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
