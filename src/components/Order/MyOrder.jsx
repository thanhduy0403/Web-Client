import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GrFormPreviousLink } from "react-icons/gr";
import axiosInstance from "../../axiosInstance";
import Input from "../../layout/Input";
import { Modal } from "antd";
import {
  Calendar,
  Eye,
  Package,
  Trash2,
  MessageCircleReply,
  Search,
  ShoppingCart,
} from "lucide-react";
import { message } from "antd";
import { Popconfirm } from "antd";
import ModalFeedback from "./ModalFeedback";

function MyOrder() {
  // lấy chi tiết đơn hàng khi có thông báo
  const [hasOpenedOrder, setHasOpenedOrder] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectOrder, setSelectedOrder] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [orders, setOrders] = useState([]);
  const [selectStatus, setSelectStatus] = useState("Tổng Đơn Hàng");
  const [searchOrder, setSearchOrder] = useState("");

  // load chi tiết đơn hàng khi có thông báo
  useEffect(() => {
    if (orderId) {
      setSelectedOrder(orderId);
      setHasOpenedOrder(true);
    }
  }, [orderId]);
  const handleCancelOrder = async (id) => {
    try {
      const res = await axiosInstance.delete(`/v1/user/order/${id}`);
      if (res.data.success) {
        messageApi.success(res.data.message);
        await getMyOrder();
      } else {
        messageApi.error(res.data.message);
      }
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };
  const orderStatus = [
    "Tổng Đơn Hàng",
    "Chưa Xác Nhận",
    "Đã Xác Nhận",
    "Đang Giao",
    "Hoàn Thành",
    "Đã Hủy",
  ];
  const getMyOrder = async () => {
    try {
      const res = await axiosInstance.get("/v1/user/order/getCreateBy");
      setOrders(res.data.getByUser);
      console.log(res.data.getByUser);
    } catch (error) {
      setOrders([]);
    }
  };

  const filterOrder = Array.isArray(orders)
    ? orders.filter((item) => {
        const matchesStatus =
          selectStatus === "" ||
          selectStatus === item.orderStatus ||
          selectStatus === "Tổng Đơn Hàng";
        const query =
          searchOrder === "" ||
          item.products.some((p) =>
            p.nameSnapshot?.toLowerCase().includes(searchOrder.toLowerCase())
          );
        return matchesStatus && query;
      })
    : [];

  const counts = orders?.reduce(
    (sum, item) => {
      sum.total += 1; // cộng thêm 1 cho tổng số đơn
      sum[item.orderStatus] = (sum[item.orderStatus] || 0) + 1; // cộng theo trạng thái
      return sum;
    },
    { total: 0 } //dây là object khởi tạo, trong đó có sẵn total = 0
  );
  const choiceOrder = (ord) => {
    setOpenFeedback(true);
    setSelectedOrder(ord);
  };
  const handleConfirmReceived = async (orderID) => {
    try {
      const res = await axiosInstance.patch(`/v1/user/order/${orderID}`, {
        receivedStatus: "Đã Nhận",
      });
      if (res.data.success) {
        messageApi.success(res.data.message);
        await getMyOrder();
        return;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
      } else {
        messageApi.error("Lỗi server");
      }
    }
  };

  useEffect(() => {
    getMyOrder();
  }, []);
  return (
    <>
      {contextHolder}

      <div className=" w-full pt-10 bg-gray-50 min-h-screen  ">
        {/* orderStatus */}
        <div className="w-[75%] gap-4 grid grid-cols-6 items-center mx-auto">
          {orderStatus.map((status) => {
            let count = 0;
            if (status === "Tổng Đơn Hàng") {
              count = counts?.total;
            } else {
              count = counts?.[status] || 0;
            }
            return (
              <div
                key={status}
                className={`border-2 h-[6rem] rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  status === "Tổng Đơn Hàng"
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                    : status === "Chưa Xác Nhận"
                    ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                    : status === "Đã Xác Nhận"
                    ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
                    : status === "Đang Giao"
                    ? "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
                    : status === "Hoàn Thành"
                    ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                    : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
                }`}
              >
                <span
                  className={`font-bold text-4xl bg-gradient-to-r bg-clip-text text-transparent ${
                    status === "Tổng Đơn Hàng"
                      ? "from-purple-500 to-pink-500"
                      : status === "Chưa Xác Nhận"
                      ? "from-orange-500 to-amber-500"
                      : status === "Đã Xác Nhận"
                      ? "from-blue-500 to-cyan-500"
                      : status === "Đang Giao"
                      ? "from-violet-500 to-purple-500"
                      : status === "Hoàn Thành"
                      ? "from-emerald-500 to-green-500"
                      : "from-red-500 to-rose-500"
                  }`}
                >
                  {count}
                </span>
                <p
                  className={`mt-2 font-semibold text-xs text-center ${
                    status === "Tổng Đơn Hàng"
                      ? "text-purple-600"
                      : status === "Chưa Xác Nhận"
                      ? "text-orange-600"
                      : status === "Đã Xác Nhận"
                      ? "text-blue-600"
                      : status === "Đang Giao"
                      ? "text-violet-600"
                      : status === "Hoàn Thành"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              </div>
            );
          })}
        </div>
        {/* filter */}
        <div className="w-[75%] mt-5 border bg-white rounded-md shadow-sm mx-auto p-4">
          {/* input */}
          <div className="mb-5 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              onChange={(e) => setSearchOrder(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              placeholder="Tìm kiếm đơn hàng theo mã sản phẩm hoặc theo tên..."
            />
          </div>
          {/* select */}
          <div className="flex items-center gap-2">
            {orderStatus.map((item, index) => (
              <button
                onClick={() => setSelectStatus(item)}
                className={`border px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectStatus === item
                    ? item === "Tổng Đơn Hàng"
                      ? "bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white shadow-lg scale-105 border-transparent"
                      : item === "Chưa Xác Nhận"
                      ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg scale-105 border-transparent"
                      : item === "Đã Xác Nhận"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105 border-transparent"
                      : item === "Đang Giao"
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-105 border-transparent"
                      : item === "Hoàn Thành"
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105 border-transparent"
                      : item === "Đã Hủy"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg scale-105 border-transparent"
                      : ""
                    : ""
                }`}
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {/* orderList */}

        <div>
          {filterOrder && filterOrder?.length > 0 ? (
            filterOrder.map((item, index) => (
              <div
                className="w-[75%] mb-4 mt-5 border-2 border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-lg mx-auto p-5 transition-all duration-300"
                key={item._id}
              >
                <div className="flex justify-between">
                  {/* CỘT TRÁI */}
                  <div className="space-y-3 flex-1">
                    {/* Mã đơn hàng */}
                    <div className="flex items-center gap-2">
                      <h1 className="text-gray-800 font-bold text-base">
                        Đơn hàng #DH00{index + 1}
                      </h1>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.orderStatus === "Chưa Xác Nhận"
                            ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg scale-105 border-transparent"
                            : item.orderStatus === "Đã Xác Nhận"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105 border-transparent"
                            : item.orderStatus === "Đang Giao"
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-105 border-transparent"
                            : item.orderStatus === "Hoàn Thành"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105 border-transparent"
                            : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg scale-105 border-transparent"
                        }`}
                      >
                        {item.orderStatus}
                      </span>
                    </div>

                    {/* Ngày tạo */}
                    <div className="flex items-center gap-2">
                      <Calendar className="text-purple-500" size={16} />
                      <span className="text-gray-600 text-sm font-medium">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {/* Hình ảnh sản phẩm */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {item.products.slice(0, 4).map((pro, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg border-2 border-white shadow-md overflow-hidden"
                          >
                            <img
                              src={pro.product.image}
                              alt={pro.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {item.products?.length > 4 && (
                          <div className="w-12 h-12 rounded-lg border-2 border-white bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-md">
                            <span className="text-purple-700 font-bold text-xs">
                              +{item.products?.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <p className="font-semibold">
                          {item.products?.length} sản phẩm
                        </p>
                        <span className="text-xs text-gray-500">
                          {item.paymentMethod}
                        </span>
                        <div className="flex items-center gap-3 mt-1 ">
                          {item.products.map((pro) => (
                            <div
                              className="border rounded-full text-white bg-blue-500  font-semibold px-2 "
                              key={pro}
                            >
                              <span>Loại: {pro.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 ">Tổng tiền:</p>
                      <span className="text-sm font-bold text-pink-500  ">
                        {item.finalPrice.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>

                  {/* CỘT PHẢI */}
                  <div className="flex flex-col items-end justify-between space-y-3">
                    {/* Trạng thái nhận hàng */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.receivedStatus === "Chưa Nhận"
                            ? "text-red-700 bg-red-100"
                            : "text-emerald-700 bg-emerald-100"
                        }`}
                      >
                        {item.receivedStatus}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 w-full">
                      {/* Nút xem chi tiết */}
                      <Link
                        to={`/orderID/${item._id}`}
                        state={{ orderCode: `#DH00${index + 1}` }}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500  to-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Eye size={16} />
                        Xem chi tiết
                      </Link>

                      {/* Nút đánh giá hoặc xác nhận */}
                      {item.receivedStatus === "Đã Nhận" ? (
                        <button
                          onClick={() => choiceOrder(item)}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <MessageCircleReply size={16} />
                          Đánh giá
                        </button>
                      ) : (
                        <Popconfirm
                          title="Xác nhận đã nhận hàng?"
                          description="Bạn đã nhận được hàng và hài lòng với sản phẩm?"
                          onConfirm={() => handleConfirmReceived(item._id)}
                          okText="Có"
                          cancelText="Không"
                          okButtonProps={{ style: { background: "#10b981" } }}
                        >
                          {item.orderStatus === "Đã Hủy" ? (
                            ""
                          ) : (
                            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                              ✓ Đã nhận hàng
                            </button>
                          )}
                        </Popconfirm>
                      )}

                      {/* Nút hủy đơn */}
                      <Popconfirm
                        title="Hủy đơn hàng?"
                        description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                        onConfirm={() => handleCancelOrder(item._id)}
                        okText="Có"
                        cancelText="Không"
                        okButtonProps={{ danger: true }}
                      >
                        <button className="flex items-center justify-center gap-2 border-2 border-red-200 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all duration-300">
                          <Trash2 size={16} />
                          Hủy đơn
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 mt-10">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-12 rounded-3xl shadow-lg text-center max-w-md">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Package size={48} className="text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn chưa có đơn hàng nào trong danh sách
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                ></Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title={null} // tắt title mặc định để custom
        closable
        open={openFeedback}
        onCancel={() => setOpenFeedback(false)}
        width={600}
        okButtonProps={{ style: { display: "none" } }} // ẩn nút OK
        cancelText="Đóng"
      >
        <div className="max-h-[70vh] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ModalFeedback
            setOpenFeedback={setOpenFeedback}
            selectOrder={selectOrder}
          />
        </div>
      </Modal>
    </>
  );
}

export default MyOrder;
