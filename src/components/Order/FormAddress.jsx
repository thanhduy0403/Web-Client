import React from "react";
import Input from "../../layout/Input";
import { FaCcVisa } from "react-icons/fa";
import logovnpay from "../../asset/logovnpay.jpg";
function FormAddress({
  setUsername_Receive,
  setPhoneNumber,
  setNote,
  paymentMethod,
  setPaymentMethod,
  setStreet,
  setWard,
  setProvince,
  setDistrict,
}) {
  const orderPaymentOption = ["Thanh Toán Khi Nhận Hàng", "Thanh Toán Online"];

  return (
    <>
      {/* Cột trái: Form thông tin */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* Thông tin người nhận */}
        <div className="border rounded-lg px-4 py-4 shadow-sm bg-white">
          <h1 className="text-lg font-semibold text-gray-800">
            Thông tin người nhận
          </h1>
          <div className="flex gap-4 mt-4">
            {/* Họ và tên */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setUsername_Receive(e.target.value)}
                className="style_address"
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            {/* Số điện thoại */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="style_address"
                placeholder="VD: 0987654321"
              />
            </div>
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="border rounded-lg px-4 py-4 shadow-sm bg-white">
          <h1 className="text-lg font-semibold text-gray-800">
            Địa chỉ giao hàng
          </h1>
          <div className="flex gap-4 mt-4">
            {/* Tỉnh/Thành phố */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setProvince(e.target.value)}
                className="style_address"
                placeholder="VD: Đà Nẵng"
              />
            </div>
            {/* Quận/Huyện */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setDistrict(e.target.value)}
                className="style_address"
                placeholder="VD: Điện Bàn"
              />
            </div>
            {/* Phường/xã */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setWard(e.target.value)}
                className="style_address"
                placeholder="VD: Điện Phương"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <Input
              onChange={(e) => setStreet(e.target.value)}
              className="style_address"
              placeholder="VD: Thanh Chiêm 1"
            />
          </div>
          {/* ghi chú */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="style_address"
              placeholder="Ghi chú thêm cho người giao hàng hoặc người bán..."
            />
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="border rounded-lg px-4 py-4 shadow-sm bg-white">
          <h1 className="text-lg font-semibold text-gray-800">
            Phương thức thanh toán
          </h1>
          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn phương thức thanh toán
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2 ">
                {orderPaymentOption.map((pay) => (
                  <label
                    key={pay}
                    className="flex items-center gap-2 cursor-pointer text-gray-700"
                  >
                    <input
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      type="radio"
                      name="paymentMethod"
                      value={pay}
                      checked={paymentMethod === pay}
                      className="w-4 h-4 text-blue-500 accent-blue-500"
                    />
                    <span>{pay}</span>
                    {pay === "Thanh Toán Online" && (
                      <img src={logovnpay} className="w-6 h-6 object-contain" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* choice payment online */}
        {paymentMethod === "Thanh Toán Online" && (
          <div className="border rounded-lg px-4 py-4 shadow-sm  mt-4 border-blue-400 bg-blue-50">
            <h2 className="text-md font-semibold text-gray-800 mb-3">
              Thanh toán qua VNPAY
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Hiển thị logo */}
              <img
                src={logovnpay}
                alt="VNPAY"
                className="w-20 h-10 object-contain"
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Bạn sẽ được chuyển sang trang VNPAY để hoàn tất thanh toán.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default FormAddress;
