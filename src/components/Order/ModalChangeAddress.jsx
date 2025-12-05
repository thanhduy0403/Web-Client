import React, { useEffect, useState } from "react";
import Input from "../../layout/Input";
import { CircleCheckBig } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { message } from "antd";

function ModalChangeAddress({ orderData, OrderDetailID, handleCancelModal }) {
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    username_Receive: "",
    phoneNumber: "",
    street: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });
  useEffect(() => {
    if (orderData) {
      setFormData({
        username_Receive: orderData.username_Receive || "",
        phoneNumber: orderData.phoneNumber || "",
        street: orderData.address?.street || "",
        province: orderData.address?.province || "",
        district: orderData.address?.district || "",
        ward: orderData.address?.ward || "",
        note: orderData.note || "",
      });
    }
  }, [orderData]);

  // handle change input
  const handleChange = (e) => {
    /* prev là state cũ của formData.
...prev copy lại toàn bộ state cũ.
[name]: value cập nhật đúng field của input đang thay đổi bằng giá trị mới. */
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangAddress = async (id) => {
    try {
      const res = await axiosInstance.patch(
        `/v1/user/order/changeAddress/${id}`,
        formData
      );
      if (res.data.success) {
        messageApi.success(res.data.message);
        await OrderDetailID();
        setTimeout(() => {
          handleCancelModal();
        }, 500);
      } else {
        messageApi.error(res.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
        console.log(error);
      }
    }
  };
  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        {/* Họ tên & SĐT */}
        <div className="w-full flex gap-4">
          {/* Họ tên */}
          <div className="w-1/2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              name="username_Receive"
              value={formData.username_Receive}
              onChange={handleChange}
              className="style_address focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          {/* Số điện thoại */}
          <div className="w-1/2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="style_address focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Địa chỉ cụ thể */}
        <div className="w-full flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Địa chỉ cụ thể <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={handleChange}
            name="street"
            value={formData.street}
            className="style_address  focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {/* tỉnh/thành, quận/huyện, phường/xã */}
        <div className="w-full flex gap-4">
          {/* tỉnh/thành  */}
          <div className="w-1/2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành <span className="text-red-500">*</span>
            </label>
            <Input
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="style_address  focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          {/* quận/huyện */}
          <div className="w-1/2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <Input
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="style_address focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          {/* phường/xã */}
          <div className="w-1/2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <Input
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="style_address focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
        {/* Ghi chú giao hàng */}
        <div className="w-full flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Ghi chú giao hàng
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={4}
            className="style_address focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={() => handleChangAddress(orderData._id)}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 
             text-white text-sm font-semibold rounded-md shadow 
             hover:bg-green-600 transition duration-200"
        >
          <CircleCheckBig className="w-5 h-5" />
          Xác nhận thay đổi
        </button>
      </div>
    </>
  );
}

export default ModalChangeAddress;
