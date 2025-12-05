import React, { useEffect, useState } from "react";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import Input from "../../layout/Input";
import { useSelector } from "react-redux";
import FavoriteProductList from "./FavoriteProductList";
import axiosInstance from "../../axiosInstance";
import { Search, Filter, Heart, X, Package, Tag } from "lucide-react";

function FavoriteProduct() {
  const [dataCate, setDataCate] = useState([]);
  const [selectCate, setSelectCate] = useState("");
  const [selectQuantity, setSelectQuantity] = useState("");
  const [search, setSearch] = useState("");
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);

  const getDataCate = async () => {
    const res = await axiosInstance.get("/v1/user/category/getList");
    setDataCate(res.data.categories);
  };

  useEffect(() => {
    getDataCate();
  }, []);

  const productQuantity = ["Còn hàng", "Sắp hết", "Hết hàng"];

  const getAmountProduct = (amount, stock) => {
    if (amount > 10 || stock > 10) return "Còn hàng";
    if (amount > 0 || (stock > 0 && amount < 10) || stock < 10)
      return "Sắp hết";
    return "Hết hàng";
  };

  const filterFavorite = Array.isArray(favoriteItems)
    ? favoriteItems.filter((item) => {
        const matchesCategory =
          selectCate === "" || selectCate === item.productID.categoryID?.name;
        const matchesQuantity =
          selectQuantity === "" ||
          selectQuantity ===
            getAmountProduct(item.productID?.amount || item.productID?.stock);
        const query =
          search === "" ||
          item.productID?.name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesQuantity && query;
      })
    : [];

  const clearAllFilters = () => {
    setSelectCate("");
    setSelectQuantity("");
    setSearch("");
  };

  const hasActiveFilters = selectCate || selectQuantity || search;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Filter Section */}
      <div className="w-[75%] mt-8 bg-white rounded-2xl shadow-xl mx-auto p-6 border border-gray-100 -translate-y-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Filter className="text-purple-500" size={20} />
            <h3 className="font-semibold text-gray-800">Bộ Lọc Sản Phẩm</h3>
          </div>
          <span className="text-gray-700 font-semibold text-sm">
            Có {filterFavorite?.length} sản phẩm trong mục yêu thích
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <X size={16} />
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-5 relative">
          <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
            placeholder="Tìm kiếm sản phẩm yêu thích..."
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">
              Danh mục:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectCate("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectCate === ""
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả danh mục
            </button>
            {dataCate &&
              dataCate.map((cate) => (
                <button
                  key={cate._id}
                  onClick={() => setSelectCate(cate.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectCate === cate.name
                      ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cate.name}
                </button>
              ))}
          </div>
        </div>

        {/* Quantity Status Filter Buttons */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">
              Trạng thái kho:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectQuantity("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectQuantity === ""
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả trạng thái
            </button>
            {productQuantity.map((qlt, index) => (
              <button
                key={index}
                onClick={() => setSelectQuantity(qlt)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectQuantity === qlt
                    ? qlt === "Còn hàng"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                      : qlt === "Sắp hết"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {qlt === "Còn hàng" && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectQuantity === qlt ? "bg-white" : "bg-green-500"
                    }`}
                  />
                )}
                {qlt === "Sắp hết" && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectQuantity === qlt ? "bg-white" : "bg-yellow-500"
                    }`}
                  />
                )}
                {qlt === "Hết hàng" && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectQuantity === qlt ? "bg-white" : "bg-red-500"
                    }`}
                  />
                )}
                {qlt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List */}
      <FavoriteProductList
        favoriteItems={favoriteItems}
        filterFavorite={filterFavorite}
      />
    </div>
  );
}

export default FavoriteProduct;
