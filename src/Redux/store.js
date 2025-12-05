import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
import favoriteSlice from "./favoriteSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    favorite: favoriteSlice,
  },
});

export default store;
