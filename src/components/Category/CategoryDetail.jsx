import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAddFavorite } from "../../hooks/useAddFavorite";
import CategoryList from "./CategoryList";
import { useFilterProduct } from "../../hooks/useFilterProduct";
import ProductCard from "../Product/ProductCard";
import { Spin, message } from "antd";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ClockArrowDown,
  ClockArrowUp,
  ArrowUpFromLine,
} from "lucide-react";

function CategoryProductList() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [search, setSearch] = useState(""); //dùng để filter hoặc lấy api
  const [searchInput, setSearchInput] = useState(""); // dùng để nhập lấy giá trị
  const { id } = useParams();
  const [cateProduct, setCateProduct] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const { handleAddFavorite } = useAddFavorite(messageApi);

  const filterOptions = [
    // { id: "all", label: "Tất cả sản phẩm", icon: Package },
    { id: "Bán chạy", label: "Bán chạy", icon: ArrowUpFromLine },
    { id: "Mới nhất", label: "Mới nhất", icon: ClockArrowUp },
    { id: "Cũ nhất", label: "Cũ nhất", icon: ClockArrowDown },
    { id: "Giá tăng dần", label: "Giá tăng dần", icon: TrendingUp },
    { id: "Giá giảm dần", label: "Giá giảm dần ", icon: TrendingDown },
  ];

  const filterProduct = useFilterProduct(categoryInfo, search, selectedFilter);

  const getCateProduct = async () => {
    const res = await axiosInstance.get(`/v1/user/category/${id}`);
    setCateProduct(res.data.category);
    setCategoryInfo(res.data.category.products);
  };

  useEffect(() => {
    getCateProduct();
  }, [id]);

  return (
    <>
      {contextHolder}

      <div className="w-[75%] mt-8 mx-auto">
        <div className="bg-gradient-to-br from-pink-50 via-white to-red-50 rounded-2xl p-8 shadow-md border border-pink-100">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
              <Package className="text-pink-500" size={28} />
              <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bạn đang xem danh mục{" "}
              <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                {cateProduct.name}
              </span>
            </h1>
            <p className="text-gray-600 text-base">
              Khám phá bộ sưu tập phụ kiện thời trang đa dạng và phong cách
            </p>
          </div>
        </div>
      </div>

      {/* Danh mục khác */}
      <div className="mt-8">
        <CategoryList showTitle={false} />
      </div>

      {/* Bộ lọc - Improved Design */}
      <div className="w-[80%] mx-auto mt-8">
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              Bộ lọc sản phẩm
            </h2>
          </div>

          {/* Input tìm kiếm */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearch(searchInput); // chỉ update search khi nhấn Enter
                  }
                }}
                placeholder="Tìm kiếm sản phẩm theo tên..."
                className="w-full px-5 py-3 pl-12 rounded-lg border-2 border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-300 scale-105 border-2 border-pink-300"
                      : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:scale-102 border-2 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <Icon size={20} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="w-[80%] mx-auto mt-6 mb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProduct.length > 0 ? (
            filterProduct.map((pro) => (
              <ProductCard
                key={pro._id}
                item={pro}
                handleAddFavorite={handleAddFavorite}
              />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              {search ? "Không tìm thấy sản phẩm" : <Spin />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryProductList;
