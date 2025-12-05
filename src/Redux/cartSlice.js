import { createSlice } from "@reduxjs/toolkit";

const getCartFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
};
const getCartIDFromLocalStorage = () => {
  return localStorage.getItem("cartID") || null;
};
const getTotalPriceProductsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("totalPriceProducts")) || 0;
};
const getTotalQuantityProductsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("totalQuantityProducts")) || 0;
};

const initialState = {
  cart: { isFetching: false, error: false },
  cartID: getCartIDFromLocalStorage(),
  cartItems: getCartFromLocalStorage(),
  totalPriceProducts: getTotalPriceProductsFromLocalStorage(),
  totalQuantityProducts: getTotalQuantityProductsFromLocalStorage(),
};

// lưu vào localStorage
const saveCartToLocalStorage = (state) => {
  localStorage.setItem("cartID", state.cartID);
  localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  localStorage.setItem(
    "totalPriceProducts",
    JSON.stringify(state.totalPriceProducts)
  );
  localStorage.setItem(
    "totalQuantityProducts",
    JSON.stringify(state.totalQuantityProducts)
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartStart: (state) => {
      state.cart.isFetching = true;
      state.cart.error = false;
    },
    addCartSuccess: (state, action) => {
      state.cart.isFetching = false;
      state.cart.error = false;

      // ✅ dữ liệu từ getCart
      const { cartID, cartWithTotalPrice, totalPriceProducts } = action.payload;

      state.cartID = cartID;
      state.cartItems = cartWithTotalPrice;
      state.totalPriceProducts = totalPriceProducts;
      state.totalQuantityProducts = cartWithTotalPrice.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // lưu vào localStorage
      saveCartToLocalStorage(state);
    },

    addCartError: (state) => {
      state.cart.isFetching = false;
      state.cart.error = true;
    },
    clearCart: (state) => {
      state.cartID = null;
      state.cartItems = [];
      state.totalPriceProducts = 0;
      state.totalQuantityProducts = 0;
      localStorage.removeItem("cartID");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalPriceProducts");
      localStorage.removeItem("totalQuantityProducts");
    },
    getCart: (state, action) => {
      state.cartID = action.payload.cartID || state.cartID;
      state.cartItems = action.payload.cartWithTotalPrice || [];
      state.totalPriceProducts = action.payload.totalPriceProducts || 0;
      state.totalQuantityProducts = (
        action.payload.cartWithTotalPrice || []
      ).reduce((sum, item) => sum + item.quantity, 0);
      saveCartToLocalStorage(state);
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (i) => i._id === action.payload.cartItemId
      );
      if (item) {
        // tính tổng số lượng và tổng tiền của 1 sản phẩm
        item.quantity++;
        item.totalPrice =
          item.quantity * item.product.discountedPrice ||
          item.quantity * item.product.price;
      }
      // cập nhật lại tổng số lượng sản phẩm trong giỏ hàng
      state.totalQuantityProducts = state.cartItems.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      // cập nhật lại tổng tiền tất cả sản phẩm trong giỏ hàng
      state.totalPriceProducts = state.cartItems.reduce(
        (sum, i) => sum + i.totalPrice
      );
      saveCartToLocalStorage(state);
    },
    decreaseQuantity: (state, action) => {
      //action.payload.cartItemId là id của sản phẩm
      const item = state.cartItems.find(
        (i) => i._id === action.payload.cartItemId
      );
      if (item && item.quantity > 1) {
        item.quantity--;
        item.totalPrice =
          item.quantity * item.product.discountedPrice ||
          item.quantity * item.product.price;
      }
      // cập nhật lại tổng số lượng sản phẩm trong giỏ hàng
      state.totalQuantityProducts = state.cartItems.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      state.totalPriceProducts = state.cartItems.reduce(
        (sum, i) => sum + i.totalPrice,
        0
      );
      saveCartToLocalStorage(state);
    },
    deleteItem: (state, action) => {
      const { _id, size } = action.payload;
      const item = state.cartItems.find(
        (i) => i._id === _id && i.size === size
      );
      if (item) {
        state.totalQuantityProducts -= item.quantity;
        state.totalPriceProducts -= item.totalPrice;
        state.cartItems = state.cartItems.filter(
          (i) => !(i._id === _id && i.size === size)
        );
      }
      saveCartToLocalStorage(state);
    },
  },
});

export const {
  addCartStart,
  addCartSuccess,
  addCartError,
  clearCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
} = cartSlice.actions;

export default cartSlice.reducer;
