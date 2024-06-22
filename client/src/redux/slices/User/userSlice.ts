import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserInfo,
  loginUser,
  registerUser,
  registerAdmin,
  updateUser,
} from "./userAsyncActions";
import { UserState } from "./types";

const initialState: UserState = JSON.parse(localStorage.getItem("user")) || {
  email: null,
  token: null,
  role: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.email = null;
      state.token = null;
      state.role = null;
      state._id = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          Object.assign(state, action.payload);
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          Object.assign(state, action.payload);
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(
        fetchUserInfo.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          Object.assign(state, action.payload);
        }
      )
      .addCase(
        registerAdmin.fulfilled,
        (
          state,
          action: PayloadAction<
            void,
            string,
            {
              arg: {
                email: string;
                password: string;
                fullName: string;
                phoneNumber: string;
              };
              requestId: string;
              requestStatus: "fulfilled";
            },
            never
          >
        ) => {}
      )
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          Object.assign(state, action.payload);
        }
      );
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
