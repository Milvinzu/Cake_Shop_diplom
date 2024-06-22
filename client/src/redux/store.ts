import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import productsReducer from "./slices/Product/productsSlices";
import cartReducer from "./slices/Cart/cartSlices";
import userReducer from "./slices/User/userSlice";
import flavorsReducer from "./slices/flavorsSlice";
import ordersReducer from "./slices/orderSlice";
import specialCakeReducer from "./slices/specialCakeSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    Products: productsReducer,
    Cart: cartReducer,
    user: userReducer,
    flavors: flavorsReducer,
    orders: ordersReducer,
    specialCake: specialCakeReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
