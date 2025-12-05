import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { Link } from "react-router-dom";
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";

// CSS của Swiper
import "swiper/css";
import "swiper/css/pagination";

function CategoryList({ showTitle = true }) {
  const [cate, setCate] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);

  const getListCate = async () => {
    try {
      const res = await axiosInstance.get("/v1/user/category/getList");
      setCate(res.data.categories || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      setCate([]);
    }
  };

  useEffect(() => {
    getListCate();
  }, []);

  const handleNextSlide = () => {
    swiperRef?.slideNext();
  };
  const handlePrevSlide = () => {
    swiperRef?.slidePrev();
  };

  return (
    <div className="w-full mt-8">
      {/* title */}
      {showTitle && (
        <div className="text-center">
          <h1 className="text-gray-800 font-bold text-xl">Danh Mục Sản Phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">
            Khám phá bộ sưu tập đa dạng của chúng tôi
          </p>
        </div>
      )}

      {/* container */}
      <div className="flex items-center w-full mt-6 gap-3 px-4 justify-center">
        <div className="max-w-[80%] w-full flex items-center gap-3 ">
          {/* Prev button */}
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-full bg-white  "
          >
            <ChevronLeft className="w-8 h-8 text-gray-400  hover:text-gray-500" />
          </button>

          {/* Swiper nằm giữa */}
          {cate.length > 0 ? (
            <Swiper
              key={cate.length} // Force re-render khi dữ liệu thay đổi
              onSwiper={(swiper) => {
                setSwiperRef(swiper);
                // Force update Swiper sau khi mount
                setTimeout(() => {
                  swiper.update();
                  swiper.slideToLoop(0);
                }, 50);
              }}
              modules={[Autoplay, Pagination, Navigation]}
              observer={true}
              observeParents={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              loop={true}
              slidesPerView={4}
              spaceBetween={20}
              className="flex-1"
            >
              {cate.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    to={`/category-detail/${item._id}`}
                    className="group rounded-lg p-3  flex flex-col items-center  justify-center hover:shadow-md transition cursor-pointer"
                  >
                    <div className=" w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-pink-500 transition duration-300">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <h1 className="mt-2 font-medium text-gray-700 text-sm text-center group-hover:text-pink-500">
                      {item.name}
                    </h1>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-500">Không có danh mục</p>
          )}

          {/* Next button */}
          <button
            onClick={handleNextSlide}
            className="p-2 rounded-full bg-white  "
          >
            <ChevronRight className="w-8 h-8 text-gray-400 hover:text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
