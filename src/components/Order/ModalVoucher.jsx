import React from "react";
import { Percent } from "lucide-react";
function ModalVoucher({
  voucher,
  setSelectVoucher,
  cartItems,
  handleCancelModal,
}) {
  const totalOrder = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  return (
    <>
      {Array.isArray(voucher) ? (
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {voucher.map((item) => {
            const canApply = totalOrder >= item.minOrderValue;
            return (
              <div
                key={item._id}
                className="flex items-center justify-between border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                {/* Nội dung bên trái */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="p-3 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Percent className="text-orange-500 w-6 h-6" />
                  </div>

                  {/* Thông tin voucher */}
                  <div className="space-y-1">
                    <div className="border bg-orange-500 rounded-md px-2">
                      <h1 className="text-lg font-semibold text-white">
                        {item.code}
                      </h1>
                    </div>
                    <p className="text-sm text-gray-600">
                      Giảm{" "}
                      <span className="font-medium text-orange-600">
                        {item.discountValue}%
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Đơn tối thiểu{" "}
                      <span className="font-medium text-gray-700">
                        {item.minOrderValue.toLocaleString("vi-VN")}đ
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Giảm tối đa{" "}
                      <span className="font-medium text-gray-700">
                        {item.maxDiscount.toLocaleString("vi-VN")}đ
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Còn lại{" "}
                      <span className="font-medium text-gray-700">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Nút áp dụng */}
                <div className="ml-4">
                  <button
                    disabled={
                      !canApply || new Date(item.expiryDate) < new Date()
                    }
                    onClick={() => {
                      console.log("Voucher chọn:", item);
                      setSelectVoucher(item);
                      handleCancelModal();
                    }}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition
                      ${
                        new Date(item.expiryDate) < new Date()
                          ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
                          : canApply
                          ? "bg-green-500 text-white cursor-allowed"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {new Date(item.expiryDate) < new Date()
                      ? "Voucher hết hạn "
                      : canApply
                      ? "Áp dụng"
                      : "Không đủ ĐK"}{" "}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 ml-3">
                    Hết hạn:
                    <span className="font-medium text-gray-700">
                      {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default ModalVoucher;
