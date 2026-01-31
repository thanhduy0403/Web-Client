import { useDispatch } from "react-redux";
import { addFavoriteProduct } from "../Redux/apiRequest";

export const useAddFavorite = (messageApi) => {
  const dispatch = useDispatch();

  const handleAddFavorite = async (id) => {
    // Kiểm tra messageApi có tồn tại không
    if (!messageApi) {
      console.error("messageApi is not provided to useAddFavorite hook");
      return;
    }

    try {
      const res = await addFavoriteProduct(dispatch, id);
      if (res?.success) {
        messageApi.success("Đã thêm vào yêu thích");
        return;
      }
      if (res?.message === "Sản phẩm đã có trong danh sách yêu thích") {
        messageApi.success("Sản phẩm đã có trong danh sách yêu thích");
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      messageApi.error(msg || "Có lỗi xảy ra");
    }
  };

  return { handleAddFavorite };
};
