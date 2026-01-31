import React, { useEffect, useState } from "react";
import { PencilLine, Save } from "lucide-react";
import Input from "../Ui/Input";

import axiosInstance from "../../axiosInstance";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, logoutSuccess } from "../../Redux/userSlice";
import { Popconfirm, message } from "antd";
import Cookies from "js-cookie";

import Cookie from "js-cookie";
import { clearCart } from "../../Redux/cartSlice";
import { clearFavorite } from "../../Redux/favoriteSlice";
import { useNavigate } from "react-router-dom";
function FormUpdate({ currentUser }) {
  const navigate = useNavigate();
  const selectGender = ["Nam", "Nữ", "Khác"];
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formDataUser, setFormDataUser] = useState({
    phoneNumber: "",
    address: "",
    introduce_yourself: "",
    last_name: "",
    first_name: "",
    date_of_birth: "",
    gender: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormDataUser({
        phoneNumber: currentUser.user.phoneNumber || "",
        address: currentUser.user.address || "",
        introduce_yourself: currentUser.user.introduce_yourself || "",
        last_name: currentUser.user.last_name || "",
        first_name: currentUser.user.first_name || "",
        date_of_birth: currentUser.user.date_of_birth || "",
        gender: currentUser.user.gender || "",
      });
    } else {
      setFormDataUser({
        phoneNumber: "",
        address: "",
        introduce_yourself: "",
        last_name: "",
        first_name: "",
        date_of_birth: "",
        gender: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = (e) => {
    if (isEditing) {
      //   messageApi("");
    }
    setIsEditing((prev) => !prev);
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axiosInstance.patch(
        "/v1/user/auth/update_profile",
        formDataUser
      );
      if (res.data.success) {
        messageApi.success(res.data.message);
        const updateUser = {
          ...currentUser,
          user: {
            ...currentUser.user,
            ...formDataUser,
          },
        };
        dispatch(authSuccess(updateUser)); // update lại redux
        Cookie.set("currentUser", JSON.stringify(updateUser)); // load lại data từ cookie
        // chuyển về trạng thái nút chỉnh sửa khi update thành công
        setTimeout(() => {
          setIsEditing(false);
        }, 500);
      } else {
        messageApi.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Lỗi server");
    }
  };
  const handelDeleteUser = async (e) => {
    e?.preventDefault(); // Thêm optional chaining
    e?.stopPropagation();
    try {
      const res = await axiosInstance.delete(
        `/v1/user/auth/${currentUser?.user._id}`
      );
      if (res.data.success) {
        messageApi.success(res.data.message);
        Cookies.remove("currentUser");
        Cookie.remove("token");
        dispatch(logoutSuccess());
        dispatch(clearCart());
        dispatch(clearFavorite());
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <>
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-center border-b  pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thông tin cá nhân
          </h1>
          <span className="text-gray-500 text-sm">
            Cập nhật thông tin cá nhân của bạn
          </span>
        </div>

        {/* Nút chỉnh sửa */}
        <button
          onClick={() => {
            if (isEditing) {
              handleUpdateProfile(); // nếu đang edit thì lưu
            } else {
              handleToggleEdit(); // nếu chưa edit thì bật edit
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isEditing ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {isEditing ? <Save size={18} /> : <PencilLine size={18} />}
          <span className="text-xs font-medium">
            {isEditing ? "Lưu" : "Chỉnh Sửa"}
          </span>
        </button>
      </div>

      {/* input */}
      <form>
        <div className="mt-6 ">
          {/* Họ và tên */}
          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ
              </label>
              <Input
                name="last_name"
                onChange={handleChange}
                className={`style_address ${
                  !isEditing
                    ? "text-gray-500 bg-gray-100"
                    : "text-gray-800 bg-white"
                }`}
                value={formDataUser.last_name}
                disabled={!isEditing}
              />
            </div>
            {/* tên */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên
              </label>
              <Input
                name="first_name"
                onChange={handleChange}
                className={`style_address ${
                  !isEditing
                    ? "text-gray-500 bg-gray-100"
                    : "text-gray-800 bg-white"
                }`}
                value={formDataUser.first_name}
                disabled={!isEditing}
              />
            </div>
          </div>
          {/* email */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              name="email"
              onChange={handleChange}
              className="style_address text-gray-600"
              value={currentUser.user.email}
              disabled
            />
          </div>
          {/* số điện thoại */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <Input
              name="phoneNumber"
              onChange={handleChange}
              className={`style_address ${
                !isEditing
                  ? "text-gray-500 bg-gray-100"
                  : "text-gray-800 bg-white"
              }`}
              value={formDataUser.phoneNumber}
              disabled={!isEditing}
            />
          </div>
          {/* giới thiệu về bản thân */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới thiệu bản thân
            </label>
            <textarea
              name="introduce_yourself"
              onChange={handleChange}
              rows={4}
              className={`style_address ${
                !isEditing
                  ? "text-gray-500 bg-gray-100"
                  : "text-gray-800 bg-white"
              }`}
              value={formDataUser.introduce_yourself}
              disabled={!isEditing}
            />
          </div>
          {/* địa chỉ */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <Input
              name="address"
              onChange={handleChange}
              className={`style_address ${
                !isEditing
                  ? "text-gray-500 bg-gray-100"
                  : "text-gray-800 bg-white"
              }`}
              value={formDataUser.address}
              disabled={!isEditing}
            />
          </div>
          {/* ngày sinh */}
          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <Input
                name="date_of_birth"
                onChange={handleChange}
                type="date"
                className={`style_address ${
                  !isEditing
                    ? "text-gray-500 bg-gray-100"
                    : "text-gray-800 bg-white"
                }`}
                value={formDataUser.date_of_birth?.slice(0, 10)} // cắt yyyy-mm-dd
                disabled={!isEditing}
              />
            </div>
            {/* giới tính */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                onChange={handleChange}
                className={`style_address ${
                  !isEditing
                    ? "text-gray-500 bg-gray-100"
                    : "text-gray-800 bg-white"
                }`}
                value={formDataUser.gender}
                disabled={!isEditing}
              >
                {selectGender.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* delete user */}
        <div className="bg-red-500 flex mt-5 w-[10rem] py-2 ml-auto items-center justify-center font-semibold text-white rounded-md">
          <Popconfirm
            title="Bạn có muốn xóa tài khoản này"
            okText="Có"
            cancelText="Không"
            onConfirm={handelDeleteUser}
          >
            <button type="button">Xóa tài khoản</button>
          </Popconfirm>
        </div>
      </form>
    </>
  );
}

export default FormUpdate;
