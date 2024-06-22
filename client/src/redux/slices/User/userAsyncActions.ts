import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config";
import { UserState, UserData } from "./types";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }) => {
    const response = await axios.post(
      `${config.API_BASE_URL}/user/register`,
      userData
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(
      `${config.API_BASE_URL}/user/login`,
      credentials
    );
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response.data;
  }
);

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { getState }) => {
    const state = getState() as { user: UserState };
    const response = await axios.get(`${config.API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${state.user.token}` },
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
);

export const updateUser = createAsyncThunk<
  any,
  UserData,
  { state: { user: UserState } }
>("user/updateUser", async (userData, { getState }) => {
  const { user } = getState();
  const response = await axios.put(`${config.API_BASE_URL}/user`, userData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
});

export const registerAdmin = createAsyncThunk(
  "user/registerAdmin",
  async (
    adminData: {
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
      role: string;
    },
    { getState }
  ) => {
    const state = getState() as { user: UserState };
    await axios.post(`${config.API_BASE_URL}/user/register/admin`, adminData, {
      headers: { Authorization: `Bearer ${state.user.token}` },
    });
  }
);

export const requestPasswordReset = createAsyncThunk(
  "user/requestPasswordReset",
  async (email: string) => {
    const response = await axios.post(
      `${config.API_BASE_URL}/user/request-password-reset`,
      { email }
    );
    return response.data;
  }
);

export const verifyPasswordResetToken = createAsyncThunk(
  "user/verifyPasswordResetToken",
  async (token: string) => {
    const response = await axios.post(
      `${config.API_BASE_URL}/user/verify-password-reset-token`,
      { token }
    );
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (data: { token: string; newPassword: string }) => {
    const response = await axios.post(
      `${config.API_BASE_URL}/user/reset-password`,
      data
    );
    return response.data;
  }
);
