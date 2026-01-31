import React from "react";
import { message, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { deleteFavoriteProduct } from "../../Redux/apiRequest";
import { Trash2, Eye, Heart, ShoppingCart, Package } from "lucide-react";
import { useDispatch } from "react-redux";

function FavoriteProductList({ filterFavorite, favoriteItems }) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleDeleteItem = async (_id) => {
    try {
      await deleteFavoriteProduct(dispatch, _id);
      messageApi.success("Đã xóa sản phẩm khỏi danh sách yêu thích");
    } catch (error) {
      messageApi.error("Xóa sản phẩm thất bại");
    }
  };

  const checkFilterFavorite =
    Array.isArray(filterFavorite) && filterFavorite.length > 0;
  const checkFavoriteItems =
    Array.isArray(favoriteItems) && favoriteItems.length > 0;

  return (
    <>
      {contextHolder}

      {/* Chưa có sản phẩm yêu thích */}
      {!checkFavoriteItems && (
        <div className="flex flex-col items-center justify-center mt-16 px-4">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-12 rounded-3xl shadow-xl w-full max-w-md text-center">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="text-pink-500" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Chưa có sản phẩm yêu thích
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi và mua
              sắm sau này
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart size={20} />
              Khám Phá Sản Phẩm
            </Link>
          </div>
        </div>
      )}

      {/* Có sản phẩm nhưng filter không ra */}
      {checkFavoriteItems && !checkFilterFavorite && (
        <div className="flex flex-col items-center justify-center mt-16 px-4">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-12 rounded-3xl shadow-xl w-full max-w-md text-center">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600">
              Không có sản phẩm nào khớp với bộ lọc hiện tại
            </p>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      {checkFilterFavorite && (
        <div className="w-[75%] mx-auto space-y-4 ">
          {filterFavorite.map((item) => (
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-[1.01]"
              key={item._id}
            >
              <div className="p-6 ">
                <div className="grid grid-cols-12 gap-6">
                  {/* CỘT TRÁI - Thông tin sản phẩm */}
                  <div className="col-span-9 flex gap-5">
                    {/* Hình ảnh sản phẩm */}
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={item.productID?.image}
                          alt={item.productID?.name}
                        />
                      </div>
                      {item.productID?.discount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          -{item.productID?.discount}%
                        </div>
                      )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {item.productID?.categoryID?.name}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              item.productID?.amount > 10 ||
                              item.productID?.stock > 10
                                ? "bg-green-100 text-green-700"
                                : item.productID?.amount > 0 ||
                                  item.productID?.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <Package size={12} />
                            {item.productID?.amount > 10 ||
                            item.productID?.stock > 10
                              ? "Còn hàng"
                              : item.productID?.amount > 0 ||
                                item.productID?.stock > 0
                              ? "Sắp hết"
                              : "Hết hàng"}
                          </span>
                        </div>

                        {/* Tên sản phẩm */}
                        <h1 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {item.productID?.name}
                        </h1>

                        {/* Ngày thêm */}
                        <div className="flex items-center text-xs text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Thêm vào:{" "}
                          {new Date(item.addedAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI - Giá và Actions */}
                  <div className="col-span-3 flex flex-col items-end justify-between">
                    {/* Giá */}
                    <div className="text-right">
                      <div className="text-md font-bold text-transparent bg-clip-text bg-pink-500 mb-1">
                        {item.productID?.discountedPrice?.toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </div>
                      {item.productID?.discount > 0 && (
                        <div className="line-through text-sm text-gray-400">
                          {item.productID?.price?.toLocaleString("vi-VN")}₫
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/product/${item.productID?._id}`}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Eye size={18} />
                        Chi Tiết
                      </Link>

                      <Popconfirm
                        title="Xóa sản phẩm yêu thích?"
                        description="Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?"
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDeleteItem(item.productID?._id)}
                      >
                        <button className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all duration-300 hover:scale-110 border border-red-200">
                          <Trash2 size={18} />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FavoriteProductList;
