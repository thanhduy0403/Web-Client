import React, { useState } from "react";
import { message, Modal } from "antd";
import Input from "../Ui/Input";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "../../Redux/apiRequest";
import SendOTP from "../ForgotPassWord/SendOTP";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axiosInstance from "../../axiosInstance";
import { authSuccess } from "../../Redux/userSlice";
import Cookie from "js-cookie";
function ModalLogin({ handleCancelLogin, showRegisterModal, setOpenLogin }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [openSendOTP, setOpenSendOTP] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handLoginUser = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      if (!email || !password) {
        message.error("Hãy điền đủ thông tin");
        return;
      }

      // gọi API login
      const res = await Login(user, dispatch);

      if (res?.success) {
        message.success("Đăng nhập thành công");
        handleCancelLogin();
      } else {
        message.error(res?.message || "Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
        return;
      } else {
        message.error("Lỗi server");
      }
    }
  };

  const handleLoginFacebook = async (accessToken, userID, profile) => {
    try {
      const res = await axiosInstance.post("/v1/user/auth/login_facebook", {
        accessToken,
        userID,
        email: profile.email,
        picture: profile.picture.data.url,
        username: profile.username,
      });
      if (res.data.message) {
        messageApi.success(res.data.message);
        dispatch(authSuccess({ user: res.data.user }));
        Cookie.set("currentUser", JSON.stringify(res.data.user), {
          expires: 30,
        });
        handleCancelLogin();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  const showOpenSendEmail = () => {
    setOpenSendOTP(true);
  };
  const handleCancelEmail = () => {
    setOpenSendOTP(false);
  };
  return (
    <>
      {contextHolder}
      <form onSubmit={handLoginUser}>
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

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              className="style_input"
              placeholder="Mật khẩu..."
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* submit */}
          <div className="w-full border py-2 rounded-md bg-pink-500 text-center ">
            <button className=" text-white">Đăng Nhập</button>
          </div>
          <p className="text-center">
            Nếu chưa có tài khoản đăng ký tại đây
            <span
              onClick={() => {
                handleCancelLogin?.();
                showRegisterModal?.();
              }}
              className=" ml-1 text-blue-500 cursor-pointer hover:underline"
            >
              Đăng ký
            </span>
          </p>
          <p
            onClick={() => {
              handleCancelLogin?.();
              showOpenSendEmail?.();
            }}
            className="text-center text-blue-500 cursor-pointer"
          >
            Quên mật khẩu
          </p>
        </div>
      </form>
      <div className="mt-2">
        <FacebookLogin
          appId={process.env.REACT_APP_FB_ID}
          onSuccess={(response) => {
            // Lấy accessToken và userID
            const { accessToken, userID } = response;

            window.FB.api(
              "/me",
              { fields: "name,email,picture" },
              async (profile) => {
                handleLoginFacebook(accessToken, userID, profile);
              },
            );
          }}
          onFail={(error) => console.log("Login Failed!", error)}
          render={({ onClick }) => (
            <button
              className="w-full bg-blue-500 text-white py-2 gap-2 rounded-md flex text-center justify-center items-center"
              onClick={onClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng Nhập Với Facebook
            </button>
          )}
        />
      </div>

      <Modal
        title={
          <h1 className="font-semibold text-center text-2xl">Quên Mật Khẩu</h1>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openSendOTP}
        onCancel={() => setOpenSendOTP(false)}
        footer={null} // ẩn 2 nút ok và cancel
        width={500}
      >
        <SendOTP
          setOpenLogin={setOpenLogin}
          setOpenSendOTP={setOpenSendOTP}
          handleCancelEmail={handleCancelEmail}
          showOpenSendEmail={showOpenSendEmail}
        />
      </Modal>
    </>
  );
}

export default ModalLogin;
