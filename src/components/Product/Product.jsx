import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import { Spin } from "antd";

import { useAddFavorite } from "../../hooks/useAddFavorite";
import { Link } from "react-router-dom";
function Product() {
  const [product, setProduct] = useState([]);
  const getListProduct = async () => {
    const res = await axiosInstance.get("/v1/user/product/getList");
    setProduct(res.data.products);
  };

  const { handleAddFavorite, contextHolder } = useAddFavorite();
  useEffect(() => {
    getListProduct();
  }, []);

  const getBestSeller = Array.isArray(product)
    ? product
        .sort((a, b) => {
          return b.soldCount - a.soldCount;
        })
        .slice(0, 4)
    : [];
  const getRecentProducts = Array.isArray(product)
    ? product
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, 4)
    : [];
  return (
    <div className="w-full mt-16 mb-8">
      {contextHolder}

      {/* BEST SELLER */}
      <div className="text-center">
        <h1 className="text-gray-800 font-bold text-2xl">
          <span className="inline-block border-b-2 border-blue-500 pb-1">
            Sản Phẩm Bán Chạy
          </span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Những sản phẩm được bán nhiều nhất
        </p>
      </div>

      <div className="w-[80%] mx-auto mt-6 mb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {getBestSeller.length > 0 ? (
            getBestSeller.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                handleAddFavorite={handleAddFavorite}
              />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              <Spin />
            </div>
          )}
        </div>
      </div>

      {/* RECENT PRODUCTS */}
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-gray-800 font-bold text-2xl ">
            <span className="inline-block border-b-2 border-red-500 pb-1">
              Sản Phẩm Gần Đây
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Những sản phẩm vừa được cập nhật
          </p>
        </div>

        <div className="w-[80%] mx-auto mt-6 mb-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {getRecentProducts.length > 0 ? (
              getRecentProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  handleAddFavorite={handleAddFavorite}
                />
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                <Spin />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Product list */}
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-gray-800 font-bold text-2xl ">
            <span className="inline-block border-b-2 border-yellow-500 pb-1">
              Danh Sách Sản Phẩm
            </span>
          </h1>
        </div>

        <div className="w-[80%] mx-auto mt-6 mb-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.length > 0 ? (
              product.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  handleAddFavorite={handleAddFavorite}
                />
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                <Spin />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" justify-center flex mt-5">
        <Link
          className=" border inline-block py-2 font-bold w-[15rem] text-white text-center
           rounded-full bg-red-500 hover:bg-red-600 transition"
          to="/product-list"
        >
          Xem Thêm Sản Phẩm
        </Link>
      </div>
    </div>
  );
}

export default Product;
