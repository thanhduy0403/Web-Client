import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useAddFavorite } from "../../hooks/useAddFavorite";
import { useLocation } from "react-router-dom";
import { useFilterProduct } from "../../hooks/useFilterProduct";
import ProductCard from "./ProductCard";
import { message } from "antd";

import {
  TrendingUp,
  TrendingDown,
  Package,
  ClockArrowDown,
  ClockArrowUp,
  ArrowUpFromLine,
  Filter,
} from "lucide-react";

function ProductList() {
  const [dataCate, setDataCate] = useState([]);
  const [selectedCate, setSelectedCate] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const location = useLocation();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  const [product, setProduct] = useState([]);

  const getDataCate = async () => {
    const res = await axiosInstance.get("/v1/user/category/getList");
    setDataCate(res.data.categories);
  };

  const filterOptions = [
    { id: "all", label: "Tất cả sản phẩm", icon: Package },
    { id: "Bán chạy", label: "Bán chạy", icon: ArrowUpFromLine },
    { id: "Mới nhất", label: "Mới nhất", icon: ClockArrowUp },
    { id: "Cũ nhất", label: "Cũ nhất", icon: ClockArrowDown },
    { id: "Giá tăng dần", label: "Giá tăng dần", icon: TrendingUp },
    { id: "Giá giảm dần", label: "Giá giảm dần", icon: TrendingDown },
  ];

  const getListProduct = async () => {
    const res = await axiosInstance.get("/v1/user/product/getList");
    setProduct(res.data.products);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const { handleAddFavorite } = useAddFavorite(messageApi);

  const filteredProducts = useFilterProduct(
    product,
    searchProduct,
    selectedFilter,
    selectedCate,
  );

  useEffect(() => {
    getListProduct();
    getDataCate();
  }, []);

  useEffect(() => {
    setSearchProduct(search);
  }, [search]);

  return (
    <>
      {contextHolder}
      <div className="w-[90%] mx-auto mt-8 mb-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 ">
          <div className="bg-gradient-to-br from-pink-50 via-white to-red-50 rounded-2xl shadow-lg border border-pink-100 overflow-hidden sticky top-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 px-5 py-4">
              <div className="flex items-center gap-3 ">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Filter className="text-white" size={22} />
                </div>
                <h2 className="text-xl font-bold text-white drop-shadow-md">
                  Bộ lọc
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 bg-pink-50">
              {/* Select category */}
              <div>
                <label className=" flex items-center gap-2  mb-2 text-sm font-semibold text-gray-700">
                  <Package size={18} className="text-pink-500" />
                  Danh mục
                </label>

                <div className="flex flex-col gap-2 space-y-2">
                  <button
                    onClick={() => setSelectedCate("")}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm
      transition-all duration-200 ${
        selectedCate === ""
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md scale-[1.02]"
          : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 hover:border-pink-300"
      }`}
                  >
                    Tất cả danh mục
                  </button>
                  {dataCate.map((cate) => {
                    return (
                      <button
                        key={cate.id}
                        onClick={() => setSelectedCate(cate._id)}
                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm
                        transition-all duration-200 ${
                          selectedCate === cate._id
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md scale-[1.02]"
                            : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        {cate.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
                <span className="text-xs font-medium text-gray-500">
                  Sắp xếp
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                {filterOptions.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 font-medium 
                        transition-all duration-200 ${
                          selectedFilter === filter.id
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md scale-[1.02]"
                            : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 hover:border-pink-300"
                        }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{filter.label}</span>
                    </button>
                  );
                })}
                <div
                  className="mt-2 bg-gradient-to-r from-pink-500 to-red-500 text-white 
                py-2 rounded-md text-center"
                >
                  <button
                    onClick={() => {
                      setSelectedCate("");
                      setSelectedFilter("all");
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="mb-6">
            {search || searchProduct ? (
              <div className="space-y-2">
                <h1 className="text-gray-800 font-bold text-3xl">
                  Kết quả tìm kiếm
                </h1>
                <p className="text-pink-600 font-medium text-lg">
                  "{search || searchProduct}"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-gray-800 font-bold text-3xl">
                  Danh sách sản phẩm
                </h1>
                <p className="text-gray-500">
                  Khám phá bộ sưu tập phụ kiện thời trang của chúng tôi
                </p>
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  handleAddFavorite={handleAddFavorite}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 text-lg font-medium">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Vui lòng thử chọn bộ lọc khác
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default ProductList;
