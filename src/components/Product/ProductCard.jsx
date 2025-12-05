import React from "react";
import { Link } from "react-router-dom";
import { Rate } from "antd";
import { CiHeart } from "react-icons/ci";
function ProductCard({ item, handleAddFavorite }) {
  const startCounts = item.ratingSummary?.startCounts || {};
  const totalRating = item.ratingSummary?.totalRating || 0;

  const totalScore = Object.entries(startCounts).reduce(
    (acc, [star, count]) => acc + Number(star) * count,
    0
  );

  const averageRating = totalRating > 0 ? totalScore / totalRating : 0;
  return (
    <>
      <Link
        to={`/product/${item._id}`}
        key={item._id}
        className="group flex flex-col rounded-xl border bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
      >
        {/* Ảnh */}
        <div className="relative w-full h-[280px] flex items-center justify-center bg-white rounded-md overflow-hidden group shadow">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-[90%] object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Yêu thích */}
          {handleAddFavorite && (
            <button
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow opacity-0 transform -translate-y-2 transition group-hover:opacity-100 group-hover:translate-y-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddFavorite(item._id);
              }}
            >
              <CiHeart
                size={18}
                className="text-gray-600 hover:text-pink-600"
              />
            </button>
          )}

          {/* Giảm giá */}
          {item.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{item.discount}%
            </span>
          )}

          {/* Nút xem */}
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition">
            <div className="text-center bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium py-2 rounded-lg shadow hover:opacity-90">
              Xem sản phẩm
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-3 flex flex-col gap-1">
          <span className="text-[11px] text-gray-400 uppercase">
            {item.categoryID?.name}
          </span>
          <Rate disabled allowHalf value={averageRating} />
          <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600">
            {item.name}
          </h2>
          <div className="flex items-center justify-between mt-2">
            {/* giá */}
            <div>
              <span className="text-pink-600 font-bold text-base">
                {item.discountedPrice.toLocaleString("de-DE")}đ
              </span>
              {item.discount > 0 && (
                <span className="ml-2 line-through text-xs text-gray-400">
                  {item.price.toLocaleString("de-DE")}đ
                </span>
              )}
            </div>
            {/* sold and related product */}
            <div>
              <p className="text-white text-xs p-1 rounded-full font-semibold border bg-blue-500">
                {item.productType}
              </p>
              <p className="text-gray-500 text-sm">
                Đã bán:{" "}
                <span className="font-bold  text-gray-800">
                  {item.soldCount}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ProductCard;
