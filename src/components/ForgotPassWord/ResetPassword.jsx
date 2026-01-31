import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { message } from "antd";
import Input from "../Ui/Input";
function ResetPassword({
  setOpenResetPassword,
  setOpenVerifyOtp,
  setOpenLogin,
  setOpenSendOTP,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const resetPassword = async () => {
    const token = localStorage.getItem("resetToken");
    try {
      const res = await axiosInstance.put(
        "/v1/user/forgot/resetpassword",
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        messageApi.success(res.data.message);
        // đóng tất cả các form
        setOpenResetPassword(false);
        setOpenVerifyOtp(false);
        setOpenSendOTP(false);
        setTimeout(() => {
          setOpenLogin(true);
        }, 500);
      } else {
        messageApi.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Lỗi server");
    }
  };
  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Nhập mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Nhập mật khẩu mới"
            className="style_input"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {/* send email */}
        <div className="w-full border py-1 rounded-md bg-pink-500 text-center ">
          <button onClick={resetPassword} className=" text-white">
            Xác nhận
          </button>
        </div>
        <div className="w-full border text-black py-1 rounded-md bg-white text-center ">
          <button
            onClick={() => setOpenResetPassword(false)}
            className=" text-black"
          >
            Quay lại
          </button>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
