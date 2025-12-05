import { useDispatch } from "react-redux";
import { message } from "antd";
import { addFavoriteSuccess } from "../Redux/favoriteSlice";
import { addFavoriteProduct } from "../Redux/apiRequest";

export const useAddFavorite = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleAddFavorite = async (id) => {
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
      {
        messageApi.error(msg);
        return;
      }
    }
  };
  return { handleAddFavorite, contextHolder };
};
