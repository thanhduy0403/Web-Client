import React from "react";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useEffect } from "react";
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

// CSS của Swiper
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
function BannerList() {
  const [bannerList, setBannerList] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);
  const getListBanner = async () => {
    try {
      const res = await axiosInstance.get("/v1/user/banner/get_All");
      setBannerList(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      setBannerList([]);
    }
  };
  useEffect(() => {
    getListBanner();
  }, []);

  const handleNextSlide = () => {
    swiperRef?.slideNext();
  };
  const handlePrevSlide = () => {
    swiperRef?.slidePrev();
  };
  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto">
        <button onClick={handlePrevSlide}>
          <ChevronLeft className="button_slide_left" />
        </button>

        {/* Container với max-width để không quá rộng trên màn hình lớn */}
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1200} // Tốc độ chuyển ảnh: 1200ms = 1.2 giây (mượt hơn)
          effect="fade" // Hiệu ứng fade mượt mà
          fadeEffect={{
            crossFade: true, // Fade chéo giữa các slide
          }}
          loop={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="w-full rounded-xl shadow-lg"
        >
          {bannerList?.map((item, index) => (
            <SwiperSlide key={index}>
              <Link to={`/banner-detail/${item._id}`}>
                <div className="relative w-full aspect-[16/5] sm:aspect-[16/6] md:aspect-[21/9] lg:aspect-[21/7]">
                  <img
                    src={item.image}
                    alt={`Banner ${index + 1}`}
                    className="
                      w-full 
                      h-full 
                      object-cover     
                      object-center   
                      rounded-xl
                    "
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={handleNextSlide}>
          <ChevronRight className="button_slide_right" />
        </button>
      </div>
    </>
  );
}

export default BannerList;
