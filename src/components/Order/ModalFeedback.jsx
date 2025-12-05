import React, { useState } from "react";
import { Rate } from "antd";
import axiosInstance from "../../axiosInstance";
import { message } from "antd";

function ModalFeedback({ selectOrder, setOpenFeedback }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [feedbacks, setFeedbacks] = useState({});

  if (!selectOrder) return null;

  const getFeedbackKey = (productID, size) => `${productID}_${size}`;
  // vì trong order có thể feed back nhiều sản phẩm nên phải lấy ra từng productID
  const handleRateChange = ({ productID, size, value }) => {
    const key = getFeedbackKey(productID, size);
    setFeedbacks((prev) => ({
      ...prev,
      [key]: { ...prev[key], rating: value },
    }));
  };
  const handleCommentChange = ({ productID, size, value }) => {
    const key = getFeedbackKey(productID, size);
    setFeedbacks((prev) => ({
      ...prev,
      [key]: { ...prev[key], comment: value },
    }));
  };

  const handleFeedback = async (productID, size) => {
    const key = getFeedbackKey(productID, size);
    const { rating, comment } = feedbacks[key] || {};
    try {
      const data = { rating, comment, size };
      const res = await axiosInstance.post(
        `/v1/user/feedback/createFeedback/${selectOrder._id}/${productID}`,
        data
      );
      if (res.data.success) {
        messageApi.success(res.data.message);
        setFeedbacks((prev) => {
          // reset lại state khi có nhiều feedback của 1 đơn hàng
          const update = { ...prev };
          delete update[key];
          return update;
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
        return;
      }
    }
  };
  return (
    <>
      {contextHolder}
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-semibold text-xl text-gray-800">
          Đánh giá sản phẩm
        </h1>
        <p className="text-yellow-500 text-sm mt-1">
          +300 điểm tích lũy sau khi đánh giá 1 sản phẩm
        </p>
      </div>

      {/* Thông tin đơn hàng */}
      <p className="mb-4 text-sm">
        <strong>Mã đơn hàng:</strong> {selectOrder._id}
      </p>

      {/* Danh sách sản phẩm */}
      <div className="space-y-6">
        {selectOrder.products.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b pb-4 last:border-none"
          >
            {/* Ảnh sản phẩm */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover rounded-md border"
              />
            </div>

            {/* Thông tin & đánh giá */}
            <div className="flex-1">
              <div>
                <span className="block text-gray-800 font-medium text-sm">
                  {item.product.name}
                </span>
                <span className="block text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()} ₫
                </span>
                <span className="block text-gray-500 text-xs mt-1">
                  Số lượng: {item.quantity} | Size: {item.size}
                </span>
              </div>

              {/* ⭐ Rate */}
              <div className="mt-3">
                <span className="text-gray-700 font-medium text-sm">
                  Mức độ hài lòng:
                </span>
                <Rate
                  onChange={(value) =>
                    handleRateChange({
                      productID: item.product._id,
                      size: item.size,
                      value,
                    })
                  }
                  value={
                    feedbacks[getFeedbackKey(item.product._id, item.size)]
                      ?.rating
                  }
                  className="text-yellow-500 mt-1"
                />
              </div>

              {/* 💬 Textarea */}
              <textarea
                onChange={(e) =>
                  handleCommentChange({
                    productID: item.product._id,
                    size: item.size,
                    value: e.target.value,
                  })
                }
                value={
                  feedbacks[getFeedbackKey(item.product._id, item.size)]
                    ?.comment || ""
                }
                placeholder="Nhập phản hồi của bạn tại đây..."
                className="mt-3 w-full min-h-[5rem] resize-none rounded-lg border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              {/* Gửi phản hồi */}
              <div className="mt-3 text-right">
                <button
                  onClick={() => handleFeedback(item.product._id, item.size)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1 rounded-md transition"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ModalFeedback;
