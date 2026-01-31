import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
const storedUser = Cookie.get("currentUser");
const userSlice = createSlice({
  name: "User",
  // initialState: {
  //   currentUser: storedUser ? JSON.parse(storedUser) : null,
  //   isFetching: false,
  //   error: false,
  // },
  initialState: {
    accessToken: null,
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    authStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    authSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
    },
    authError: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    updateUserPoints: (state, action) => {
      if (state.currentUser) {
        state.currentUser.user.point = action.payload;
      }
    },
    logoutSuccess: (state) => {
      state.isFetching = false;
      state.currentUser = null;
      state.accessToken = null;
      state.error = false;
    },
  },
});

export const {
  setAccessToken,
  authStart,
  authSuccess,
  authError,
  logoutSuccess,
  updateUserPoints,
} = userSlice.actions;
export default userSlice.reducer;
