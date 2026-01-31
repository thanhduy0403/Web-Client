import React from "react";
import CategoryList from "../../components/Category/CategoryList";
import Product from "../../components/Product/Product";
import { useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { authSuccess, updateUserPoints } from "../../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import BannerList from "../../components/Banner/BannerList";
function Index() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(accessToken);
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Chỉ fetch khi có token NHƯNG chưa có user
      if (!accessToken || currentUser) {
        return;
      }

      try {
        const res = await axiosInstance.get("/v1/user/auth/fetchme");
        if (res.data.user) {
          dispatch(authSuccess({ user: res.data.user }));
        }
      } catch (err) {
        console.log("Lỗi fetch user:", err);
      }
    };

    fetchUserProfile();
  }, [dispatch, accessToken, currentUser]); // Thêm currentUser vào dependency
  return (
    <>
      <div className="bg-pink-50">
        <BannerList />
        <CategoryList />
        <Product />
      </div>
    </>
  );
}

export default Index;
