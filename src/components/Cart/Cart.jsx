import React from "react";
import Navbar from "../Navbar";
import { Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrFormPreviousLink } from "react-icons/gr";
import { decrease, deleteCartItem, increase } from "../../Redux/apiRequest";
import { Link } from "react-router-dom";
function Cart() {
  const { cartItems, totalQuantityProducts } = useSelector(
    (state) => state.cart
  );

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  console.log(cartItems);
  const handleDeleteItem = async (product, size, _id) => {
    try {
      await deleteCartItem(dispatch, size, product._id);
      messageApi.success("Xóa thành công");
    } catch (error) {
      messageApi.error("Xóa thất bại");
    }
  };
  const handleIncreaseQuantity = async (product, size, quantity, _id) => {
    if (size) {
      const sizeInfo = product.sizes.find((s) => s.size === size);
      if (quantity + 1 > sizeInfo.quantity) {
        messageApi.error("Số lượng size không đủ");
        return;
      }
    } else {
      if (quantity + 1 > product.stock) {
        messageApi.error("Số lượng sản phẩm không đủ");
        return;
      }
    }
    await increase(dispatch, quantity + 1, size, product._id);
  };
  const handleDecreaseQuantity = async (product, size, quantity, _id) => {
    if (size) {
      const sizeInfo = product.sizes.find((s) => s.size === size);
      if (sizeInfo.quantity < 1) {
        messageApi.error("Bạn có muốn xóa sản phẩm");
      }
    } else {
      if (quantity < 1) {
        messageApi.error("Bạn có muốn xóa sản phẩm");
      }
    }
    await decrease(dispatch, quantity - 1, size, product._id);
  };
  return (
    <>
      {contextHolder}
      <div className="mt-10 w-full flex px-[5rem] gap-8">
        {/* Giỏ hàng */}
        <div className="flex-1 mb-3 border rounded-xl p-5 bg-white shadow-md">
          {/* header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              🛒 Sản phẩm trong giỏ
            </h1>
            <span className="text-xs font-medium border border-gray-400 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {cartItems.length} sản phẩm
            </span>
          </div>

          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                >
                  {/* ảnh sản phẩm */}
                  <div className="w-24 h-24 flex-shrink-0 relative">
                    {/* Discount badge */}
                    <span className="absolute -top-2 -right-1  bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      -{item.product.discount}%
                    </span>

                    {/* Product image */}
                    <img
                      className="w-full h-full object-cover rounded-md border"
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  </div>

                  {/* thông tin */}
                  <div className="flex-1 space-y-2">
                    <h1 className="font-semibold text-gray-800">
                      {item.product.name}
                    </h1>
                    {item.size && (
                      <span className="inline-block px-3 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                        Size: {item.size}
                      </span>
                    )}

                    {/* giá */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg font-bold text-pink-600">
                        {item.product.discountedPrice.toLocaleString()} ₫
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {item.product.price.toLocaleString()} ₫
                      </span>
                    </div>

                    {/* số lượng */}
                    <div className="flex items-center gap-2">
                      {item.quantity <= 1 ? (
                        <Popconfirm
                          title="Bạn có muốn xóa sản phẩm này?"
                          okText="Có"
                          cancelText="Không"
                          onConfirm={() =>
                            handleDeleteItem(item.product, item.size, item._id)
                          }
                        >
                          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
                            -
                          </button>
                        </Popconfirm>
                      ) : (
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(
                              item.product,
                              item.size,
                              item.quantity,
                              item._id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          -
                        </button>
                      )}

                      <input
                        value={item.quantity}
                        readOnly
                        className="w-14 text-center border rounded-md bg-gray-50"
                      />

                      <button
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.product,
                            item.size,
                            item.quantity,
                            item._id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* tổng giá */}
                  <div className="flex flex-col items-end space-y-3 w-32">
                    <span className="font-bold text-base text-gray-800">
                      {item.totalPrice.toLocaleString()} ₫
                    </span>
                    <Popconfirm
                      title="Bạn có chắc muốn xóa sản phẩm này không?"
                      okText="Có"
                      cancelText="Không"
                      onConfirm={() =>
                        handleDeleteItem(item.product, item.size, item._id)
                      }
                    >
                      <button className="px-2 py-1 text-sm bg-red-100  text-red-600 rounded-md hover:bg-red-200 transition">
                        <RiDeleteBin6Line size={17} />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">Giỏ hàng trống</p>
          )}
        </div>

        {/* Thống kê */}
        <div className="w-[28rem] h-fit border rounded-xl p-5 bg-white shadow-md sticky top-20">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            Tóm tắt đơn hàng
          </h2>
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>Tổng số lượng sản phẩm</span>
            <span>{totalQuantityProducts}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Tạm tính</span>
            <span>
              {cartItems
                .reduce((sum, item) => sum + item.totalPrice, 0)
                .toLocaleString()}{" "}
              ₫
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg ">
            <span className="text-gray-900">Tổng cộng:</span>
            <span className="text-pink-500 ">
              {cartItems
                .reduce((sum, item) => sum + item.totalPrice, 0)
                .toLocaleString()}{" "}
              ₫
            </span>
          </div>
          <Link to={"/order"}>
            <button className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg  ">
              Đặt hàng ngay
            </button>
          </Link>
          <div className="mt-5">
            <Link to={"/"}>
              <button className="border w-full flex items-center justify-center gap-2 px-4 py-3  text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition">
                <GrFormPreviousLink className="text-xl" />
                <span>Tiếp tục mua sắm</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
