import React, { useEffect, useState } from "react";
import Input from "../Ui/Input";
import { FaRegHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Login/ModalLogin";
import Register from "../Register/ModalRegister";
import { message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import Cookies from "js-cookie";
import { logoutSuccess } from "../../Redux/userSlice";
import { Avatar } from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { clearCart } from "../../Redux/cartSlice";
import { Box } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { clearFavorite } from "../../Redux/favoriteSlice";
import Notification from "./Notification";
import { Coins, ShoppingCart } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [search, setSearch] = useState("");
  const totalItem = useSelector((state) => state.cart?.cartItems);
  const currentUser = useSelector((state) => state.user?.currentUser);
  console.log(currentUser);
  const totalFavoriteProducts = useSelector(
    (state) => state.favorite?.favoriteItems,
  );

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/v1/user/auth/logout");
      message.success("Đăng xuất thành công");
      Cookies.remove("currentUser");
      dispatch(logoutSuccess());
      dispatch(clearCart());
      dispatch(clearFavorite());
      localStorage.removeItem("recentlyViewed");

      // QUAN TRỌNG: Xóa thông báo khi logout
      localStorage.removeItem("client_notifications");
      localStorage.removeItem("client_notification_count");

      window.dispatchEvent(new Event("client_logout"));
    } catch (error) {
      message.error("Đăng xuất thất bại");
    }
  };
  const showLoginModal = () => {
    setOpenLogin(true);
  };
  const showRegisterModal = () => {
    setOpenRegister(true);
  };

  const handleCancelLogin = () => {
    setOpenLogin(false);
  };
  const handleCancelRegister = () => {
    setOpenRegister(false);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      navigate(`/product-list?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      <div className="w-full bg-pink-600 h-[2rem] px-[3rem] text-sm py-1 justify-between flex items-center">
        <div className="flex items-center gap-4 text-white  ">
          <span>📞 Hotline: 0706021404</span>
          <span>🚚 Miễn phí vận chuyển toàn quốc</span>
        </div>
        {/* đơn hàng của tôi */}
        <div className="text-white flex items-center gap-2 ">
          <Box size={18} />
          <Link to={"/my-order"}>Đơn hàng của tôi</Link>
          <CiHeart size={18} />
          <Link to={"/my-favorite"}>Yêu thích</Link>
          <span className="ml-3">Hỗ trợ</span>
        </div>
        {/* đơn hàng của tôi */}
      </div>
      <div className="sticky  top-0 w-full h-16 flex items-center justify-between px-10 border-b bg-white shadow-sm  z-50">
        {/* Logo */}
        <Link to={"/"} className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">F</span>
          </div>

          {/* Tên + slogan */}
          <div className="flex flex-col leading-tight">
            <h1 className="font-bold text-2xl text-gray-800 hover:text-purple-600 transition-colors">
              FashionHub
            </h1>
            <span className="text-sm text-gray-500">Phụ kiện thời trang</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex items-center w-[30rem] relative">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full rounded-full px-4 py-1 pr-10 text-sm border border-gray-300 focus:ring-2 focus:ring-black/50 transition-all"
            placeholder="Tìm kiếm sản phẩm tại đây..."
          />
          <CiSearch
            onClick={handleSearch}
            className="absolute right-3 text-gray-500 text-xl cursor-pointer hover:text-black transition"
          />
        </div>

        {/* Icons */}

        <div className="flex items-center text-gray-600 gap-4">
          {/* điểm tích lũy */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-1 shadow-sm">
              <Coins className="text-yellow-600 w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">
                {currentUser.user?.point} điểm tích lũy
              </span>
            </div>
          )}
          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Icon yêu thích */}
            <Link to="/my-favorite" className="relative">
              <FaRegHeart className="text-xl cursor-pointer hover:text-red-500 transition-colors duration-300" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1 py-0.2 rounded-full shadow">
                {totalFavoriteProducts.length}
              </span>
            </Link>

            {/* Icon giỏ hàng */}
            <Link to="/cart" className="relative">
              {/* Badge số lượng */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1 py-0.2 rounded-full shadow">
                {totalItem.length}
              </span>
              <ShoppingCart className="text-2xl cursor-pointer hover:text-black transition-colors duration-300" />
            </Link>
            {/* thông báo */}
            <Notification />
          </div>
          {/* Login / Register */}

          {currentUser ? (
            <div className="flex items-center gap-3 px-3 py-1 border rounded-full shadow-sm hover:shadow-md transition bg-white">
              <Avatar size="small" icon={<UserOutlined />} />
              <Link to={"/my-profile"} className="text-sm font-medium">
                {currentUser?.user?.username}
              </Link>
              <span
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-600 cursor-pointer text-sm hover:text-pink-500 transition"
              >
                <LogoutOutlined className="text-xs" />
                Đăng xuất
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 border rounded-full shadow-sm hover:shadow-md transition bg-white">
              <span
                onClick={showLoginModal}
                className="flex items-center gap-1 text-gray-600 cursor-pointer text-sm hover:text-pink-500 transition"
              >
                <LoginOutlined className="text-xs" />
                Đăng nhập
              </span>
              <span className="text-gray-400">/</span>
              <span
                onClick={showRegisterModal}
                className="text-gray-600 cursor-pointer text-sm hover:text-pink-500 transition"
              >
                Đăng ký
              </span>
            </div>
          )}
        </div>
      </div>
      <Modal
        title={
          <h1 className="font-semibold text-center text-2xl">Đăng nhập</h1>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openLogin}
        onCancel={handleCancelLogin}
        footer={null} // ẩn 2 nút ok và cancel
        width={500}
      >
        <Login
          setOpenLogin={setOpenLogin}
          handleCancelLogin={handleCancelLogin}
          showRegisterModal={showRegisterModal}
        />
      </Modal>
      <Modal
        title={<h1 className="font-semibold text-2xl text-center">Đăng ký</h1>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={openRegister}
        onCancel={handleCancelRegister}
        footer={null} // ẩn 2 nút ok và cancel
        width={500}
      >
        <Register
          handleCancelRegister={handleCancelRegister}
          showLoginModal={showLoginModal}
        />
      </Modal>
    </>
  );
}

export default Navbar;
