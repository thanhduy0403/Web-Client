import React, { useEffect, useState } from "react";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { Box, MapPin } from "lucide-react";
import { Modal } from "antd";
import ModalChangeAddress from "./ModalChangeAddress";

function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const orderCode = location.state?.orderCode;
  const [openModal, setOpenModal] = useState(false);

  const OrderDetailID = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/order/${id}`);
      setData(res?.data?.findOderID);
    } catch (error) {
      setData(null);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCancelModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    OrderDetailID();
  }, [id]);
  return (
    <>
      <div className="w-full flex flex-col items-center py-6">
        <div className="max-w-5xl w-full flex gap-6 items-start">
          {/* Bên trái */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Cột trái 1 */}
            <div className="border rounded-lg px-4 py-4 shadow-sm bg-white">
              <div className="flex items-center gap-2 font-semibold">
                <Box size={20} className="text-blue-500" />
                <h1 className="text-lg">Thông tin đơn hàng</h1>
              </div>
              <div className="flex justify-between mt-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">Ngày đặt: </p>
                    <span className="text-sm font-semibold">
                      {new Date(data?.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Dự kiến giao: </p>
                    <span className="text-sm font-semibold">
                      {data?.expectedDeliveryAt
                        ? new Date(data?.expectedDeliveryAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chờ Xác Định"}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Phương thức thanh toán:
                    </p>
                    <span className="text-sm font-semibold">
                      {data?.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Mã vận đơn: </p>
                    <span className="text-sm text-blue-500 font-semibold">
                      VN{data?._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột trái 2 */}
            <div className="border rounded-lg px-4 py-4 shadow-sm bg-white">
              {/* title */}
              <div className="flex items-center gap-2 font-semibold">
                <h1 className="text-lg">Sản phẩm đã đặt</h1>
              </div>
              {/* order list */}
              <div>
                {data ? (
                  <div className="space-y-3">
                    {data.products.map((item) => (
                      <div
                        key={item._id}
                        className="border flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white"
                      >
                        {/* Hình ảnh */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md border"
                          />
                        </div>

                        {/* Thông tin */}
                        <div className="flex-1">
                          <h1 className="text-gray-800 font-semibold">
                            {item.product.name}
                          </h1>
                          <div className="text-gray-500 flex text-sm gap-2">
                            <div>
                              <span> Size: </span>
                              <span className="font-medium">
                                {item.size || "Không có"}
                              </span>
                            </div>
                            <div>
                              <span> Số lượng: </span>
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Giá */}
                        <div className="text-right text-red-500 text-sm font-bold">
                          {(
                            item.quantity * item.product.discountedPrice
                          ).toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Bên phải: Tóm tắt đơn hàng */}
          <div className="w-1/3 border rounded-lg px-4 py-4 shadow-md bg-white">
            <h1 className="font-semibold text-lg mb-4 text-center">
              Tóm tắt đơn hàng
            </h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium text-gray-800">
                  {data?.totalPriceProduct.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-2 flex items-center justify-between font-semibold text-gray-800">
              <span className="text-gray-600">Tổng cộng:</span>
              <span className="font-medium text-gray-800">
                {data?.finalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-center items-center gap-2 text-lg mb-4 font-semibold text-gray-800">
                <MapPin size={22} className="text-blue-500" />
                <h1 className="tracking-wide">Địa chỉ giao hàng</h1>
              </div>
              <span className="text-sm text-gray-900">
                {[
                  data?.address.street,
                  data?.address.ward,
                  data?.address.district,
                  data?.address.province,
                ].join("-")}
              </span>
              {data?.orderStatus === "Chưa Xác Nhận" ||
              data?.orderStatus === "Đã Xác Nhận" ? (
                <div
                  onClick={() => handleOpenModal(data)}
                  className="w-full py-1 cursor-pointer mt-2 text-center font-semibold text-white rounded-md bg-green-500"
                >
                  <button>Thay đổi địa chỉ giao hàng</button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="mt-6 border-t pt-4">
              <h1 className="tracking-wide text-center text-lg font-semibold text-gray-800 mb-2">
                Trạng thái đơn hàng
              </h1>
              <div className="flex justify-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-center text-xs font-semibold tracking-wide
      ${
        data?.orderStatus === "Chưa Xác Nhận"
          ? "text-yellow-600 bg-yellow-100"
          : data?.orderStatus === "Đã Xác Nhận"
          ? "text-blue-600 bg-blue-100"
          : data?.orderStatus === "Đang Giao"
          ? "text-purple-600 bg-purple-100"
          : data?.orderStatus === "Hoàn Thành"
          ? "text-green-600 bg-green-100"
          : "text-red-600 bg-red-100"
      }`}
                >
                  {data?.orderStatus}
                </span>
              </div>
            </div>

            {/* Nội dung tóm tắt ở đây */}
          </div>
        </div>
      </div>
      <Modal
        title={
          <h1 className="font-semibold text-center text-md">
            Thay Đổi Địa Chỉ Giao Hàng
          </h1>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModal}
        onCancel={handleCancelModal}
        width={500}
        okButtonProps={{ style: { display: "none" } }} // ẩn ok
        cancelText="Đóng"
      >
        <ModalChangeAddress
          handleCancelModal={handleCancelModal}
          OrderDetailID={OrderDetailID}
          orderData={data}
        />
      </Modal>
    </>
  );
}

export default OrderDetail;
