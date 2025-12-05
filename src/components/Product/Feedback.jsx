import React, { useState } from "react";
import { Rate } from "antd";

function Feedback({ data, averageRating }) {
  const [visibleCount, setVisibleCount] = useState(3);
  if (!Array.isArray(data)) return [];

  const displayFeedback = data.slice(0, visibleCount);
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };
  return (
    <>
      <div className="mt-5 w-[90%] mx-auto  rounded-2xl max-h-screen mb-2 bg-white">
        <div className="p-5">
          <div className="justify-between flex items-center">
            <h1 className="text-xl text-gray-700 font-bold">
              Đánh giá sản phẩm
            </h1>

            <div>
              <Rate value={averageRating} disabled allowHalf />
              <span className="font-medium ml-2 ">
                {averageRating ? averageRating : 0}/5
              </span>
              <span className="text-gray-700 ml-2 ">
                ({displayFeedback?.length}) đánh giá
              </span>
            </div>
          </div>
          <div className="mt-4">
            {displayFeedback.length > 0 ? (
              <div className="space-y-5 ">
                {displayFeedback.map((item) => (
                  <div
                    className="flex items-center border-b border-gray-200 justify-between "
                    key={item._id}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-gray-700">
                        {item.userID.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="font-semibold  ">
                          {item.userID.username}
                          <span className="ml-2">
                            <Rate value={item.rating} disabled />
                          </span>
                        </h1>
                        <span className="text-gray-700 text-sm">
                          {item.comment}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <span className="text-gray-600 font-semibold">
                  Sản phẩm chưa có đánh giá nào
                </span>
              </div>
            )}
            {/* nút xem thêm ẩn bớt */}
            {data.length > visibleCount && (
              <div className="text-center mt-3 ">
                <button
                  className="text-blue-500 font-semibold hover:text-blue-700"
                  onClick={handleLoadMore}
                >
                  Xem thêm feedback
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Feedback;
