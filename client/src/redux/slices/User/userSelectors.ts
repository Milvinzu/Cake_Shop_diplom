import { RootState } from "../../store";
import { UserState } from "./types";
import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state: RootState) => state.user;

export const selectUserEmail = createSelector(
  selectUser,
  (user: UserState) => user.email
);

export const selectUserFullName = createSelector(
  selectUser,
  (user: UserState) => user.fullName
);

export const selectUserPhoneNumber = createSelector(
  selectUser,
  (user: UserState) => user.phoneNumber
);

export const selectUserToken = createSelector(
  selectUser,
  (user: UserState) => user.token
);

export const selectUserId = createSelector(
  selectUser,
  (user: UserState) => user._id
);
