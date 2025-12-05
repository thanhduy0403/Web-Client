import React, { useState } from "react";
import Input from "../../layout/Input";
import VerifyOTP from "./VerifyOTP";
import { message, Modal } from "antd";
import axiosInstance from "../../axiosInstance";

function SendOTP({ setOpenLogin, setOpenSendOTP }) {
  const [email, setEmail] = useState("");
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const sendOTP = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/forgot/sendOTP`, {
        params: { email },
      });
      if (res.data.success) {
        messageApi.success(res.data.message);
        setTimeout(setOpenVerifyOtp(true), 500);
      } else {
        messageApi.error(res.data.message);
        return;
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
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Địa chỉ email"
            className="style_input"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* send email */}
        <div className="w-full border py-1 rounded-md bg-pink-500 text-center ">
          <button onClick={sendOTP} className=" text-white">
            Gửi mã OTP
          </button>
        </div>
      </div>

      <Modal
        title={
          <h1 className="font-semibold text-center text-2xl">Xác thực OTP</h1>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openVerifyOtp}
        onCancel={() => setOpenVerifyOtp(false)}
        footer={null} // ẩn 2 nút ok và cancel
        width={500}
      >
        <VerifyOTP
          setOpenLogin={setOpenLogin}
          setOpenVerifyOtp={setOpenVerifyOtp}
          setOpenSendOTP={setOpenSendOTP}
        />
      </Modal>
    </>
  );
}

export default SendOTP;
