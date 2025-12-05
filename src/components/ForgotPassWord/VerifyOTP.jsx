import React, { useState } from "react";
import Input from "../../layout/Input";
import { message, Modal } from "antd";
import axiosInstance from "../../axiosInstance";
import ResetPassword from "./ResetPassword";

function VerifyOTP({ setOpenVerifyOtp, setOpenLogin, setOpenSendOTP }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const verifyOTP = async () => {
    try {
      const res = await axiosInstance.post("/v1/user/forgot/verifyOTP", {
        otp,
      });
      if (res.data.success) {
        messageApi.success(res.data.message);
        localStorage.setItem("resetToken", res.data.resetToken);
        setTimeout(() => {
          setOpenResetPassword(true);
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
            Nhập Mã OTP <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Nhập mã OTP"
            className="style_input"
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        {/* send email */}
        <div className="w-full border py-1 rounded-md bg-pink-500 text-center ">
          <button onClick={verifyOTP} className=" text-white">
            Xác nhận
          </button>
        </div>
        <div className="w-full border text-black py-1 rounded-md bg-white text-center ">
          <button
            onClick={() => setOpenVerifyOtp(false)}
            className=" text-black"
          >
            Quay lại
          </button>
        </div>
      </div>
      <Modal
        title={
          <h1 className="font-semibold text-center text-2xl">
            Đăt lại mật khẩu
          </h1>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openResetPassword}
        onCancel={() => setOpenResetPassword(false)}
        footer={null} // ẩn 2 nút ok và cancel
        width={500}
      >
        <ResetPassword
          setOpenVerifyOtp={setOpenVerifyOtp}
          setOpenLogin={setOpenLogin}
          setOpenResetPassword={setOpenResetPassword}
          setOpenSendOTP={setOpenSendOTP}
        />
      </Modal>
    </>
  );
}

export default VerifyOTP;
