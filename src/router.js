import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import ProductDetail from "./components/Product/ProductDetail";
import ModalRegister from "./components/Register/ModalRegister";
import Cart from "./components/Cart/Cart";
import CheckOut from "./components/Order/CheckOut";
import MyOrder from "./components/Order/MyOrder";
import OrderDetail from "./components/Order/OrderDetail";
import FavoriteProduct from "./components/Favorite/FavoriteProduct";
import MyProfile from "./components/MyProfile/MyProfile";
import CategoryDetail from "./components/Category/CategoryDetail";
import ProductList from "./components/Product/ProductList";
import BannerDetail from "./components/Banner/BannerDetail";
import ClientLayOut from "./components/ClientLayOut";
function router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /các trang không dùng Layout Client */}

        {/* các trang dùng client lay out */}
        <Route path="/" element={<ClientLayOut />}>
          <Route path="/ModalRegister" element={<ModalRegister />}></Route>
          <Route path="/order" element={<CheckOut />}></Route>
          <Route path="/my-order" element={<MyOrder />}></Route>
          <Route path="/orderID/:id" element={<OrderDetail />}></Route>
          <Route path="/my-favorite" element={<FavoriteProduct />}></Route>
          <Route path="/my-profile" element={<MyProfile />}></Route>
          <Route
            path="/category-detail/:id"
            element={<CategoryDetail />}
          ></Route>
          <Route index element={<Home />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/product-list" element={<ProductList />}></Route>
          <Route path="/banner-detail/:id" element={<BannerDetail />}></Route>
          <Route path="/product/:id" element={<ProductDetail />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default router;
