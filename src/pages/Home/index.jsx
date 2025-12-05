import React from "react";
import CategoryList from "../../components/Category/CategoryList";
import Product from "../../components/Product/Product";
import { useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { authSuccess, updateUserPoints } from "../../Redux/userSlice";
import { useDispatch } from "react-redux";
import BannerList from "../../components/Banner/BannerList";
function Index() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get("/v1/user/auth/profile");

        if (res.data.success) {
          dispatch(authSuccess({ user: res.data.user }));
          if (res.data.user?.point !== undefined) {
            dispatch(updateUserPoints(res.data.user.point));
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserProfile();
  }, [dispatch]);
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
