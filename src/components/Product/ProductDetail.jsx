import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { message } from "antd";
import { CiShoppingCart } from "react-icons/ci";
import { addCart } from "../../Redux/apiRequest";
import { useDispatch } from "react-redux";
import { GrFormNextLink } from "react-icons/gr";
import CommentProduct from "./CommentProduct";
import Feedback from "./Feedback";
import ProductCard from "./ProductCard";
import { useAddFavorite } from "../../hooks/useAddFavorite";

function ProductDetail() {
  // ========== 1. ROUTER HOOKS ==========
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  // ========== 2. REDUX HOOKS ==========
  const dispatch = useDispatch();

  // ========== 3. THIRD-PARTY HOOKS ==========
  const [messageApi, messageContextHolder] = message.useMessage();

  // ========== 4. CUSTOM HOOKS ==========
  const { handleAddFavorite } = useAddFavorite(messageApi);

  // ========== 5. CONSTANTS ==========
  const Product_Information = [
    "Mô tả sản phẩm",
    "Đánh giá từ khách hàng",
    "Hỏi đáp về sản phẩm",
  ];

  // ========== 6. STATE HOOKS ==========
  // Product data
  const [productDetail, setProductDetail] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [relateProducts, setRelateProducts] = useState([]);

  // Feedback data
  const [data, setData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Product selection
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(0);

  // UI state
  const [selectInfo, setSelectInfo] = useState(Product_Information[0]);
  const [hasOpenedProduct, setHasOpenedProduct] = useState(false);

  // ========== 7. EFFECTS ==========
  // Update mainImage when productDetail changes
  useEffect(() => {
    if (productDetail?.image) {
      setMainImage(productDetail.image);
    }
  }, [productDetail]);

  // Handle productId from search params
  useEffect(() => {
    if (productId) {
      setHasOpenedProduct(true);
    }
  }, [productId]);

  // Fetch data when id changes
  useEffect(() => {
    getFeedbackProduct();
    getDetailProduct();
    getRelatedProducts();
    window.scrollTo(0, 0);
  }, [id]);

  // Handle recently viewed products
  useEffect(() => {
    if (!productDetail) return;

    let viewed = [];
    try {
      viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    } catch (error) {
      viewed = [];
    }

    const exists = viewed.find((item) => item._id === productDetail._id);
    let updateList;

    if (!exists) {
      updateList = [productDetail, ...viewed];
    } else {
      updateList = [
        productDetail,
        ...viewed.filter((item) => item._id !== productDetail._id),
      ];
    }

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updateList.slice(0, 4)),
    );
  }, [productDetail]);

  // ========== 8. API FUNCTIONS ==========
  const getFeedbackProduct = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/feedback/getList/${id}`);
      if (res.data.success) {
        setData(res.data.feedbackList);
        setAverageRating(res.data.averageRating);
      }
    } catch (error) {
      setData([]);
    }
  };

  const getDetailProduct = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/product/${id}`);
      setProductDetail(res.data.product);
    } catch (error) {
      setProductDetail(null);
    }
  };

  const getRelatedProducts = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/product/related/${id}`);
      setRelateProducts(res.data.related);
    } catch (error) {
      setRelateProducts([]);
    }
  };

  // ========== 9. HANDLER FUNCTIONS ==========
  const handleAddToCart = async (id) => {
    try {
      if (!id) {
        messageApi.error("Sản phẩm không tồn tại");
        return;
      }

      if (productDetail.sizes.length > 0 && !selectedSize) {
        messageApi.error("Vui lòng chọn size");
        return;
      }

      const res = await addCart(dispatch, id, quantity, selectedSize);
      if (res.success) {
        messageApi.success("Thêm vào giỏ hàng thành công");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        messageApi.error(error.response.data.message);
      }
    }
  };

  const increase = () => {
    if (productDetail.sizes.length > 0) {
      if (!selectedSize) {
        messageApi.error("Vui lòng chọn size");
        return;
      }
      if (quantity + 1 > maxQuantity) {
        messageApi.error("Số lượng trong kho không đủ");
        return;
      }
    } else {
      if (quantity + 1 > productDetail.stock) {
        messageApi.error("Số lượng trong kho không đủ");
        return;
      }
    }
    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    if (quantity <= 1) {
      messageApi.error("Số lượng không thể nhỏ hơn 1");
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  // ========== 10. UTILITY FUNCTIONS ==========
  const qualityStatus = () => {
    const amount = productDetail?.amount ?? 0;
    const stock = productDetail?.stock ?? 0;

    if (amount > 10 || stock > 10) {
      return "Còn hàng";
    }

    if ((amount > 0 || stock > 0) && (amount < 10 || stock < 10)) {
      return "Sắp hết";
    }

    return "Hết hàng";
  };

  // ========== 11. COMPUTED VALUES ==========
  const viewedProducts = JSON.parse(
    localStorage.getItem("recentlyViewed") || "[]",
  );

  // ========== 12. RENDER ==========
  return (
    <>
      {messageContextHolder}
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Hình ảnh */}
          <div>
            {/* Ảnh chính */}
            <div className="w-full h-[28rem] rounded-xl overflow-hidden flex items-center justify-center shadow-md bg-white">
              <img
                className="w-full max-h-full rounded-md object-container hover:scale-105 transition-transform duration-300"
                src={mainImage || productDetail?.image}
                alt={productDetail?.name}
              />
            </div>

            {/* Gallery */}
            <div className="flex gap-3 mt-4">
              {[productDetail?.image, ...(productDetail?.gallery || [])].map(
                (item, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(item)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-transform duration-300 hover:scale-105 ${
                      mainImage === item ? "border-pink-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={item}
                      alt={`gallery-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
            {/* Tên */}
            <h1 className="text-xl font-bold text-gray-800">
              {productDetail?.name}
            </h1>

            {/* Giá */}
            <div className="flex items-center gap-5">
              <span className="text-xl font-bold text-pink-600">
                {productDetail?.discountedPrice.toLocaleString("de-DE")} VNĐ
              </span>
              <span className="line-through text-gray-500 font-medium">
                {productDetail?.price.toLocaleString("de-DE")} VNĐ
              </span>
              <span className="bg-red-500 text-white px-3 py-1 text-sm rounded-full font-semibold">
                -{productDetail?.discount}%
              </span>
            </div>

            {/* Trạng thái */}
            <div
              className={`inline-block font-semibold text-xs py-1 px-4 rounded-full shadow-sm ${
                qualityStatus() === "Còn hàng"
                  ? "bg-green-100 text-green-700"
                  : qualityStatus() === "Sắp hết"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {qualityStatus()}
            </div>

            {/* Size */}
            <div>
              {productDetail?.sizes && productDetail?.sizes.length > 0 ? (
                <>
                  <h2 className="mb-3 font-semibold text-gray-700">
                    Kích Thước
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {productDetail.sizes.map((item) => {
                      const isSelected = selectedSize === item.size;
                      const isOutOfStock = item.quantity === 0;
                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            if (isOutOfStock) return;
                            setSelectedSize(item.size);
                            setMaxQuantity(item.quantity);
                            setQuantity(1);
                          }}
                          className={`px-4 py-2 border rounded-lg cursor-pointer font-medium transition shadow-sm ${
                            isOutOfStock
                              ? "text-gray-600 border-gray-300 cursor-not-allowed pointer-events-none"
                              : isSelected
                                ? "border-pink-500 bg-pink-50 text-pink-600"
                                : "border-gray-300 hover:border-pink-400"
                          }`}
                        >
                          Size {item.size}: ({item.quantity})
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="font-medium text-blue-600">
                  Còn lại: {productDetail?.stock}
                </p>
              )}
            </div>

            {/* Số lượng */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Số lượng
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrease}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  value={quantity}
                  readOnly
                  className="w-14 text-center border rounded-md"
                />
                <button
                  onClick={increase}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút thêm giỏ hàng */}
            <button
              onClick={() => handleAddToCart(productDetail?._id)}
              className="w-full flex items-center justify-center gap-2 
              py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              <CiShoppingCart className="text-xl" />
              Thêm vào giỏ hàng
            </button>
            <Link
              to={"/cart"}
              className="w-full flex items-center justify-center gap-2 
  py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 
  text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              <GrFormNextLink className="text-xl" />
              Giỏ hàng của tôi
            </Link>
          </div>
        </div>

        {/* product information */}
        <div className="w-[90%] mt-[3rem] mx-auto mb-5 flex justify-center items-center gap-5">
          {Product_Information.map((item) => (
            <div className="text-xl text-gray-700" key={item}>
              <p
                onClick={() => setSelectInfo(item)}
                className={`cursor-pointer px-3 py-1 font-bold
                   hover:text-blue-500 hover:scale-105 transition-all duration-300 ease-in-out relative ${
                     selectInfo === item
                       ? "border-b text-blue-500 border-blue-500 font-semibold transition-transform"
                       : ""
                   }`}
              >
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          {selectInfo === "Mô tả sản phẩm" ? (
            <div className="w-[90%] mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h1 className="font-bold text-xl text-white flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Mô tả sản phẩm
                </h1>
              </div>

              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {productDetail?.description}
                </p>
              </div>
            </div>
          ) : selectInfo === "Đánh giá từ khách hàng" ? (
            <Feedback data={data} averageRating={averageRating} />
          ) : selectInfo === "Hỏi đáp về sản phẩm" ? (
            <CommentProduct />
          ) : null}
        </div>

        {/* product type */}
        <div className="w-[90%] mt-[5rem] mx-auto max-h-screen mb-5">
          <div>
            <h1 className="p-4 text-xl font-bold text-gray-700">
              Sản phẩm cùng loại
            </h1>
            <div className="grid grid-cols-4 items-center gap-6 mb-5 p-2">
              {relateProducts?.length > 0 ? (
                relateProducts.map((item) => (
                  <div key={item._id}>
                    <ProductCard
                      item={item}
                      handleAddFavorite={handleAddFavorite}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-4 flex justify-center items-center">
                  <span className="text-gray-600 font-semibold">
                    Chưa có sản phẩm cùng loại
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* recently viewed products */}
        <div className="w-[90%] mt-[2rem] mx-auto max-h-screen mb-5">
          <div>
            <h1 className="p-4 text-xl font-bold text-gray-700">
              Sản phẩm đã xem
            </h1>
            <div className="grid grid-cols-4 items-center gap-6 mb-5 p-2">
              {viewedProducts?.length > 0 ? (
                viewedProducts.map((item) => (
                  <div key={item._id}>
                    <ProductCard
                      item={item}
                      handleAddFavorite={handleAddFavorite}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-4 flex justify-center items-center">
                  <span className="text-gray-600 font-semibold">
                    Chưa có sản phẩm nào xem gần đây
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
