import { createSlice } from "@reduxjs/toolkit";

const getFavoriteFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("favoriteItems")) || [];
};
const getFavoriteIDFromLocalStorage = () => {
  return localStorage.getItem("favoriteID") || null;
};

const initialState = {
  favorite: { isFetching: false, error: false },
  favoriteID: getFavoriteIDFromLocalStorage(),
  favoriteItems: getFavoriteFromLocalStorage(),
};

const saveFavoriteLocalStorage = (state) => {
  localStorage.setItem("favoriteID", state.favoriteID);
  localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavoriteStart: (state) => {
      state.favorite.isFetching = true;
      state.favorite.error = false;
    },
    addFavoriteSuccess: (state, action) => {
      state.favorite.isFetching = false;
      state.favorite.error = false;
      state.favoriteID = action.payload._id; // _id của Favorite
      state.favoriteItems = action.payload.products; // mảng products của Favorite
      saveFavoriteLocalStorage(state);
    },
    addFavoriteError: (state) => {
      state.favorite.isFetching = false;
      state.favorite.error = true;
    },
    getFavorite: (state, action) => {
      const data = action.payload; // đây là object favorite từ BE
      state.favoriteID = data._id; // _id của Favorite
      state.favoriteItems = data.products; // mảng products populate
      saveFavoriteLocalStorage(state);
    },

    clearFavorite: (state) => {
      state.favoriteID = null;
      state.favoriteItems = [];
      localStorage.removeItem("favoriteID");
      localStorage.removeItem("favoriteItems");
    },
    deleteItemFavorite: (state, action) => {
      const { _id } = action.payload;
      state.favoriteItems.find((item) => item._id === _id);
      saveFavoriteLocalStorage(state);
    },
  },
});

export const {
  addFavoriteStart,
  addFavoriteSuccess,
  addFavoriteError,
  clearFavorite,
  getFavorite,
  deleteItemFavorite,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
