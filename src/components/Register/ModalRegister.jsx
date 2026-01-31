import React, { useState } from "react";
import Input from "../Ui/Input";
import { message } from "antd";
import { register } from "../../Redux/apiRequest";
import { useDispatch } from "react-redux";
import { authSuccess } from "../../Redux/userSlice";

function ModalRegister({ handleCancelRegister, showLoginModal }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = { username: userName, email: email, password: password };
      if (!userName || !email || !password) {
        messageApi.error("Hãy điền đủ thông tin");
        return;
      }
      const res = await register(user, dispatch);
      if (res?.success) {
        messageApi.success("Đăng ký thành công");
        await handleCancelRegister();
      } else {
        messageApi.error(res?.message || "Email đã tồn tại");
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Lỗi server");
    }
  };
  return (
    <>
      {contextHolder}
      <form onSubmit={handleRegister}>
        <div className="space-y-4">
          {/* Tên đăng nhập */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Tên đăng nhập<span className="text-red-500">*</span>{" "}
            </label>
            <Input
              onChange={(e) => setUserName(e.target.value)}
              className="style_input"
              placeholder="Tên đăng nhập..."
            />
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Email<span className="text-red-500">*</span>{" "}
            </label>
            <Input
              className="style_input"
              placeholder="Địa chỉ email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Mật khẩu<span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              className="style_input"
              placeholder="Mật khẩu.."
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* submit */}
          <div className="w-full py-1 bg-pink-500 text-center rounded-md">
            <button className=" text-white  ">Đăng ký</button>
          </div>
          <p className="text-center">
            Đã có tài khoản đăng nhập tại đây
            <span
              className="text-blue-500 cursor-pointer ml-1 hover:underline"
              onClick={() => {
                handleCancelRegister?.();
                showLoginModal?.();
              }}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </form>
    </>
  );
}

export default ModalRegister;
