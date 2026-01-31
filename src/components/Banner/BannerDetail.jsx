import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useEffect } from "react";
import Navbar from "../Navbar";
import ProductCard from "../Product/ProductCard";
import { useAddFavorite } from "../../hooks/useAddFavorite";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ClockArrowDown,
  ClockArrowUp,
  ArrowUpFromLine,
} from "lucide-react";
import { message } from "antd";
import { useFilterProduct } from "../../hooks/useFilterProduct";

function BannerDetail() {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [products, setProducts] = useState([]);
  const [bannerDetail, setBannerDetail] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { handleAddFavorite } = useAddFavorite(messageApi);

  // count down
  const [countDown, setCountDown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const getDetailBanner = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/banner/${id}`);
      if (res.data.type === "single") {
        navigate(`/product/${res.data.product._id}`);
      } else {
        setType("multiple");
        setProducts(res.data.products || []);
        setBannerDetail(res.data.checkBanner);
        console.log(res.data);
      }
    } catch (error) {
      setType("multiple");
      setProducts([]);
    }
  };

  useEffect(() => {
    getDetailBanner();
  }, [id]);

  // useEffect countdown
  useEffect(() => {
    if (!bannerDetail?.endDate) return;
    const end = new Date(bannerDetail.endDate).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = end - now;
      if (distance < 0) {
        clearInterval(timer);
        setCountDown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      // days lấy tổng số giây chia cho mili giây trong 1 ngày 1s = 1000ms
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // hours b1 distance / (1000 * 60 * 60 * 24) vd = 2 ngày 5 giờ ==> phần dư là 5h
      //  ==> phần dư là 5h chia cho mili giây của 1h
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      // minutes b1 (distance % (1000 * 60 * 60) phần dư sau khi trừ hết ngày và h
      // chia cho (1000 * 60) ra số phút
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // seconds b1 (distance % (1000 * 60) phần dư sau khi trừ ngày giờ và phút
      // chia cho (1000 mili của 1 giây) ra số giây
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountDown({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bannerDetail]);

  // Filter options
  const filterOptions = [
    { id: "all", label: "Tất cả sản phẩm", icon: Package },
    { id: "Bán chạy", label: "Bán chạy", icon: ArrowUpFromLine },
    { id: "Mới nhất", label: "Mới nhất", icon: ClockArrowUp },
    { id: "Cũ nhất", label: "Cũ nhất", icon: ClockArrowDown },
    { id: "Giá tăng dần", label: "Giá tăng dần", icon: TrendingUp },
    { id: "Giá giảm dần", label: "Giá giảm dần ", icon: TrendingDown },
  ];

  const filterProduct = useFilterProduct(products, "", selectedFilter, "");
  return (
    <>
      {contextHolder}
      {bannerDetail && (
        <>
          {/* Hero Banner Section */}
          <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 py-12 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex-1">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm font-medium mb-3">
                    🔥 Chương trình Hot
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                    {bannerDetail.title}
                  </h1>
                  <p className="text-pink-100 text-lg">
                    Khám phá {products.length} sản phẩm đặc biệt
                  </p>
                </div>

                {/* Countdown Timer - Optional */}
                <div className="flex gap-2">
                  {[
                    countDown.days,
                    countDown.hours,
                    countDown.minutes,
                    countDown.seconds,
                  ].map((time, idx) => (
                    <div
                      key={idx}
                      className="bg-white/20 backdrop-blur-sm px-5 py-4 rounded-xl text-center min-w-[80px] border border-white/30"
                    >
                      <div className="text-3xl font-bold text-white">
                        {time}
                      </div>
                      <div className="text-xs text-pink-100 uppercase font-medium mt-1">
                        {["Ngày", "Giờ", "Phút", "Giây"][idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            {/* Filter Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Danh sách sản phẩm
                </h2>
                <div className="text-sm text-gray-500">
                  Hiển thị{" "}
                  <span className="font-semibold text-gray-800">
                    {products.length}
                  </span>{" "}
                  sản phẩm
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {filterOptions.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <div>
                      <button
                        onClick={() => setSelectedFilter(filter.id)}
                        key={filter.id}
                        className={`flex items-center gap-2 border px-6 py-3 font-medium whitespace-normal transition-all rounded-md ${
                          selectedFilter === filter.id
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Icon size={18} />
                        {filter.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Products Grid */}
            {filterProduct.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filterProduct.map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    handleAddFavorite={handleAddFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Package size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có sản phẩm
                </h3>
                <p className="text-gray-500">
                  Không tìm thấy sản phẩm nào trong chương trình này
                </p>
              </div>
            )}

            {/* Load More Button */}
            {products.length > 0 && products.length >= 20 && (
              <div className="text-center mt-12">
                <button className="px-10 py-4 bg-white border-2 border-pink-500 text-pink-500 rounded-xl font-bold hover:bg-pink-500 hover:text-white transition-all shadow-md hover:shadow-xl">
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* Promotion Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <div className="inline-block bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold mb-4">
                  💎 DEAL ĐẶC BIỆT
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Giảm giá lên đến 50%!
                </h2>
                <p className="text-pink-100 text-lg mb-6">
                  Áp dụng cho tất cả sản phẩm trong chương trình. Số lượng có
                  hạn!
                </p>
                <button className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default BannerDetail;
