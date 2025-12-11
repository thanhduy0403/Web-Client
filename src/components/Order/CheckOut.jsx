import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { GrFormPreviousLink } from "react-icons/gr";
import Input from "../../layout/Input";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { orderProduct } from "../../Redux/apiRequest";
import FormAddress from "./FormAddress";
import ModalVoucher from "./ModalVoucher";
import { Modal } from "antd";
import { Coins, TicketCheck } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { updateUserPoints } from "../../Redux/userSlice";

function Order() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [messageApi, contextHolder] = message.useMessage();
  const [userPoints, setUsePoints] = useState(0);
  const [selectVoucher, setSelectVoucher] = useState(null);
  const [username_Receive, setUsername_Receive] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [province, setProvince] = useState(""); // tỉnh/thành phố
  const [district, setDistrict] = useState(""); //  Quận/Huyện
  const [ward, setWard] = useState(""); // phường/xã
  const [street, setStreet] = useState(""); // Địa chỉ cụ thể
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartID =
    useSelector((state) => state.cart.cartID) || localStorage.getItem("cartID");

  const { cartItems, totalQuantityProducts } = useSelector(
    (state) => state.cart
  );
  const [voucher, setVoucher] = useState([]);
  const getListVoucher = async () => {
    const res = await axiosInstance.get("/v1/user/voucher/getList");
    setVoucher(res.data.data);
    console.log(res.data.data);
  };

  // Tính tổng tiền
  const totalOrder = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Hàm tính giảm giá từ voucher
  const calculateDiscount = () => {
    if (!selectVoucher) return 0;
    if (totalOrder < selectVoucher.minOrderValue) return 0;
    let discount = (totalOrder * selectVoucher.discountValue) / 100;
    if (discount > selectVoucher.maxDiscount) {
      discount = selectVoucher.maxDiscount;
    }
    return discount;
  };
  const discountAmount = calculateDiscount();
  const finalTotal = totalOrder - discountAmount - userPoints;
  useEffect(() => {
    getListVoucher();
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCancelModal = () => {
    setOpenModal(false);
  };
  const handleOrderProduct = async (e) => {
    e.preventDefault();
    if (!username_Receive || !phoneNumber) {
      messageApi.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newOrder = {
      username_Receive,
      phoneNumber,
      note,
      address: {
        province,
        district,
        ward,
        street,
      },
      voucherID: selectVoucher ? selectVoucher._id : null,
      pointsUser: userPoints ? userPoints : 0,
      paymentMethod,
    };

    try {
      const res = await orderProduct(dispatch, newOrder, cartID);
      if (res && res.data && res.data.success) {
        // ✅ Nếu thanh toán qua VNPay
        if (paymentMethod === "Thanh Toán Online") {
          const orderID = res.data.order._id;
          const vnpayRes = await axiosInstance.get(
            `/v1/user/pay/vnpay/${orderID}`
          );

          if (vnpayRes.data.success) {
            window.location.href = vnpayRes.data.paymentURL;
          } else {
            messageApi.error("Không tạo được url thanh toán");
          }
          return;
        } else {
          messageApi.success("Order sản phẩm thành công ");

          // ✅ COD
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
      }
    }
  };

  const handleUsePointClick = () => {
    // nếu chọn bấm lại thì hủy dùng điểm
    if (userPoints > 0) {
      setUsePoints(0);
      // chưa chọn bấm lại thì lấy hết
    } else {
      setUsePoints(currentUser?.user?.point || 0);
    }
  };

  // Khi redirect từ VNPay về
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await axiosInstance.get("/v1/user/auth/profile"); // API trả về thông tin user mới nhất
  //     dispatch(updateUserPoints(res.data.user.point));
  //   };
  //   fetchUser();
  // }, []);

  return (
    <>
      {contextHolder}
      <div className="w-full flex flex-col items-center py-6">
        <div className="max-w-5xl w-full flex gap-6 items-start">
          {/* Cột trái: Form thông tin */}
          <FormAddress
            setUsername_Receive={setUsername_Receive}
            setPhoneNumber={setPhoneNumber}
            setNote={setNote}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            setStreet={setStreet}
            setWard={setWard}
            setProvince={setProvince}
            setDistrict={setDistrict}
          />

          {/* Cột phải */}
          <div className="w-1/3 self-start space-y-4">
            {/* Tóm tắt đơn hàng */}
            <div className="border rounded-lg px-4 py-4 shadow-md bg-white">
              <h1 className="text-lg font-semibold text-gray-800 mb-4">
                Tóm tắt đơn hàng
              </h1>

              <div className="text-sm text-gray-600">
                <p className="flex items-center justify-between text-gray-600 mt-2">
                  <span className="text-[14px] font-medium text-gray-700">
                    Số sản phẩm:
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {totalQuantityProducts} sản phẩm
                  </span>
                </p>

                {/* Danh sách sản phẩm */}
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2 border-b last:border-none"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.product.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      x
                      <span className="font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Tổng cộng */}
              <div className="mt-4 border-t pt-2 flex items-center justify-between font-semibold text-gray-800">
                <span className="text-md font-medium">Tổng cộng:</span>
                <span className="text-red-500 text-md font-bold">
                  {totalOrder.toLocaleString()}₫
                </span>
              </div>
              {/* Giá khi áp dụng voucher */}
              <div className="mt-4 border-t pt-2 flex items-center justify-between font-semibold text-gray-800">
                <span className="text-md font-medium ">
                  Giá khi sử dụng voucher:
                </span>
                <span className="text-red-500 text-md font-bold">
                  {finalTotal.toLocaleString()}₫
                </span>
              </div>

              {/* Nút đặt hàng */}
              <div className="w-full bg-blue-500 mt-4 text-center py-2 rounded-md">
                <button
                  onClick={handleOrderProduct}
                  className="text-white font-semibold"
                >
                  Xác Nhận Đặt Hàng
                </button>
              </div>
            </div>

            {/* Voucher nằm dưới */}
            <div className="border rounded-2xl px-5 py-5 shadow-md bg-white hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <TicketCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Mã giảm giá
                </h2>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                {selectVoucher ? (
                  <p>
                    {" "}
                    Bạn đang áp dụng voucher{" "}
                    <span className="text-green-500 font-bold">
                      {selectVoucher.code}
                    </span>
                  </p>
                ) : (
                  " Chọn voucher để nhận ưu đãi hấp dẫn cho đơn hàng của bạn"
                )}
              </p>

              <button
                onClick={handleOpenModal}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium transition duration-300"
              >
                <TicketCheck className="w-4 h-4" />
                <span>Chọn voucher</span>
              </button>
              <div className="flex items-center mt-4 justify-between border rounded-xl p-3 bg-gradient-to-r from-yellow-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Coins className="text-yellow-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      Điểm tích lũy
                    </p>
                    <p className="text-yellow-600 font-bold text-base">
                      {currentUser?.user?.point ?? 0}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUsePointClick}
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow ${
                    userPoints
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {userPoints ? "Hủy dụng điểm" : "Sử dụng điểm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={null} // tắt title mặc định để custom
        closable
        open={openModal}
        onCancel={handleCancelModal}
        width={600}
        okButtonProps={{ style: { display: "none" } }} // ẩn nút OK
        cancelText="Đóng"
        className="rounded-2xl overflow-hidden"
      >
        {/* Header tùy chỉnh */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full">
              <TicketCheck className="w-7 h-7 text-green-600" />
            </div>
          </div>
          <h1 className="font-semibold text-xl text-gray-800">
            Danh sách voucher
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Áp dụng voucher để nhận ưu đãi tốt nhất cho đơn hàng của bạn
          </p>
        </div>

        {/* Nội dung danh sách voucher */}
        <ModalVoucher
          voucher={voucher}
          setVoucher={setVoucher}
          selectVoucher={selectVoucher}
          setSelectVoucher={setSelectVoucher}
          cartItems={cartItems}
          handleCancelModal={handleCancelModal}
        />
      </Modal>
    </>
  );
}

export default Order;
