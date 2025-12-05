import React from "react";
import { GrFormPreviousLink } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {} from "lucide-react";
import FormUpdate from "./FormUpdate";
import { Navigate } from "react-router-dom";

function MyProfile() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <div className="w-full flex pt-10 bg-gray-50 min-h-screen px-[10rem] gap-2 mb-2 ">
        {/* Cột trái */}
        <div className="w-[35%] bg-white h-[24rem] border border-gray-200 rounded-2xl shadow-lg flex flex-col items-center py-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full p-2">
              <FaRegUserCircle size={60} className="text-white" />
            </div>

            {/* Tên và email */}
            <h1 className="font-semibold text-2xl text-gray-800 mt-3">
              {currentUser.user.username}
            </h1>
            <p className="text-gray-500 text-sm">{currentUser.user.email}</p>

            {/* Ngày tạo */}
            <p className="text-gray-400 text-xs mt-1">
              Thành viên từ{" "}
              {new Date(currentUser.user.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Giới thiệu */}
          <div className="mt-4 px-4 text-center">
            <p className="text-gray-600 text-sm italic">
              “
              {currentUser.user.introduce_yourself ||
                "Chưa có giới thiệu bản thân"}
              ”
            </p>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center gap-2 mt-5 bg-gray-50 px-3 py-2 rounded-lg">
            <CiLocationOn size={20} className="text-green-500" />
            <span className="text-sm text-gray-600">
              {currentUser.user.address || "Chưa có địa chỉ"}
            </span>
          </div>
        </div>
        {/* Cột phải */}
        <div className="w-[65%] bg-white h-auto border rounded-2xl shadow-lg px-8 py-6">
          <FormUpdate currentUser={currentUser} />
        </div>{" "}
      </div>
    </>
  );
}

export default MyProfile;
