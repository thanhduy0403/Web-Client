import axiosInstance from "../axiosInstance";
import {
  addCartError,
  addCartStart,
  addCartSuccess,
  clearCart,
  decreaseQuantity,
  deleteItem,
  getCart,
  increaseQuantity,
} from "./cartSlice";
import {
  addFavoriteError,
  addFavoriteStart,
  addFavoriteSuccess,
  deleteItemFavorite,
  getFavorite,
} from "./favoriteSlice";
import { authError, authStart, authSuccess } from "./userSlice";
import Cookies from "js-cookie";

export const Login = async (user, dispatch) => {
  dispatch(authStart());
  try {
    const res = await axiosInstance.post(`/v1/user/auth/login`, user);
    dispatch(authSuccess(res.data));
    Cookies.set("currentUser", JSON.stringify(res.data), { expires: 30 });
    Cookies.set("token", res.data.token, { expires: 30 });
    localStorage.getItem("recentlyViewed");
    // localStorage.getItem("client_notifications");
    // localStorage.getItem("client_notification_count");
    window.dispatchEvent(new Event("client_login"));

    await getCartUser(dispatch);
    await getFavoriteProduct(dispatch);
    return res.data;
  } catch (error) {
    dispatch(authError());
    throw error;
  }
};

export const register = async (user, dispatch) => {
  dispatch(authStart());
  try {
    const res = await axiosInstance.post(`/v1/user/auth/register`, user);
    dispatch(authSuccess(res.data));
    Cookies.set("currentUser", JSON.stringify(res.data), { expires: 30 });
    Cookies.set("token", res.data.token, { expires: 30 });
    await getCartUser(dispatch);
    await getFavoriteProduct(dispatch);
    return res.data;
  } catch (error) {
    dispatch(authError());
  }
};

export const addCart = async (dispatch, id, quantity, size = null) => {
  dispatch(addCartStart());
  try {
    await axiosInstance.post(`/v1/user/cart/${id}`, {
      quantity,
      size: size || null,
    });
    await getCartUser(dispatch);
    return { success: true }; // ✅ báo thành công
  } catch (error) {
    dispatch(addCartError());
    throw error;
  }
};
export const getCartUser = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/v1/user/cart/getCart");
    dispatch(getCart(res.data));
    return res.data;
  } catch (error) {
    console.log("error");
  }
};
export const increase = async (dispatch, quantity, size, _id) => {
  try {
    const res = await axiosInstance.patch(`/v1/user/cart/${_id}`, {
      quantity,
      size,
    });
    dispatch(increaseQuantity(res.data));
    await getCartUser(dispatch);
  } catch (error) {
    console.log(error);
  }
};
export const decrease = async (dispatch, quantity, size, _id) => {
  try {
    const res = await axiosInstance.patch(`/v1/user/cart/${_id}`, {
      quantity,
      size,
    });
    dispatch(decreaseQuantity(res.data));
    await getCartUser(dispatch);
  } catch (error) {
    console.log(error);
  }
};
export const deleteCartItem = async (dispatch, size, _id) => {
  try {
    const res = await axiosInstance.delete(`/v1/user/cart/${_id}`, {
      data: { size },
    });
    dispatch(deleteItem(res.data));
    await getCartUser(dispatch);
  } catch (error) {
    console.log(error);
  }
};

export const orderProduct = async (dispatch, info, cartID) => {
  if (!cartID) {
    console.error("Lỗi: cartIDProduct bị null!");
    return;
  }
  try {
    const res = await axiosInstance.post(`/v1/user/order/${cartID}`, info, {
      withCredentials: true,
    });
    //localStorage.removeItem("cartID");
    dispatch(clearCart());
    return res;
  } catch (error) {
    if (error.response) {
      console.error("Lỗi API đặt hàng:", error.response.data);
    } else {
      console.error("Lỗi API đặt hàng:", error.message);
    }
    return null;
  }
};

export const addFavoriteProduct = async (dispatch, id) => {
  dispatch(addFavoriteStart());
  try {
    const res = await axiosInstance.post(`/v1/user/favorite/${id}`);
    // dispatch(addFavoriteSuccess(res.data.favorite));
    await getFavoriteProduct(dispatch);
    return res.data;
  } catch (error) {
    dispatch(addFavoriteError());
    throw error;
  }
};

export const getFavoriteProduct = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/v1/user/favorite/getFavorite");
    dispatch(getFavorite(res.data.data));
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFavoriteProduct = async (dispatch, _id) => {
  try {
    const res = await axiosInstance.delete(`/v1/user/favorite/${_id}`);
    dispatch(deleteItemFavorite(res.data));
    await getFavoriteProduct(dispatch);
  } catch (error) {
    console.log(error);
  }
};
