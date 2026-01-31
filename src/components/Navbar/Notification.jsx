import React, { useEffect, useState } from "react";
import { Bell, ShoppingCart } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import formatDateTime from "../../util/formatDateTime";

function Notification() {
  const [showBell, setShowBell] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const currentUser = useSelector((state) => state.user?.currentUser);

  // Helper functions để làm việc với localStorage theo userId
  const getStorageKey = (key) => {
    if (!currentUser?.user?._id) return null;
    return `${key}_${currentUser.user._id}`;
  };

  const saveToLocalStorage = (notifications) => {
    const notificationKey = getStorageKey("client_notifications");
    const countKey = getStorageKey("client_notification_count");

    if (notificationKey && countKey) {
      localStorage.setItem(notificationKey, JSON.stringify(notifications));
      localStorage.setItem(countKey, notifications.length.toString());
    }
  };

  const loadFromLocalStorage = () => {
    const notificationKey = getStorageKey("client_notifications");
    const countKey = getStorageKey("client_notification_count");
    if (!notificationKey || !countKey) {
      return { savedNoti: [], savedCount: 0 };
    }

    try {
      const savedNoti = JSON.parse(
        localStorage.getItem(notificationKey) || "[]"
      );
      const savedCount = parseInt(localStorage.getItem(countKey) || "0", 10);

      return {
        savedNoti: Array.isArray(savedNoti) ? savedNoti : [],
        savedCount: isNaN(savedCount) ? 0 : savedCount,
      };
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      return { savedNoti: [], savedCount: 0 };
    }
  };

  const clearOldUserData = () => {
    // Xóa các key không có userId (data cũ)
    localStorage.removeItem("client_notifications");
    localStorage.removeItem("client_notification_count");
  };

  // Load thông báo từ localStorage khi component mount hoặc user thay đổi
  useEffect(() => {
    const reloadNoti = () => {
      if (!currentUser?.user?._id) {
        setNotifications([]);
        setNotificationCount(0);
        return;
      }

      const { savedNoti, savedCount } = loadFromLocalStorage();

      console.log("📦 Loaded notifications:", savedNoti);
      console.log("🔢 Loaded count:", savedCount);

      setNotifications(savedNoti);

      // Xóa data cũ không có userId
      clearOldUserData();
    };

    // Gọi ngay khi mount hoặc user thay đổi
    reloadNoti();

    // Listen sự kiện client_login
    window.addEventListener("client_login", reloadNoti);

    return () => {
      window.removeEventListener("client_login", reloadNoti);
    };
  }, [currentUser?.user?._id]);

  // Socket listener
  useEffect(() => {
    if (socket && currentUser?.user?._id) {
      socket.emit("join_user", currentUser.user._id);
    }

    const handleConfirmOrder = (mess) => {
      const timestamp = Date.now();
      //  FIX: Tạo notificationId duy nhất từ orderId + orderStatus + timestamp
      const notificationId = `${mess.confirmOrderStatus._id}_${mess.confirmOrderStatus.orderStatus}_${timestamp}`;

      const newMess = {
        notificationId: notificationId, // ID duy nhất cho notification
        orderId: mess.confirmOrderStatus._id, // ID đơn hàng (để navigate)
        data: mess.confirmOrderStatus,
        type: "confirm_order",
        orderStatus: mess.confirmOrderStatus.orderStatus,
        timestamp: timestamp,
        isRead: false,
      };
      pushNotification(newMess);
    };

    const handleCancelOrder = (mess) => {
      const timestamp = Date.now();
      const notificationId = `${mess.checkOrderIDCancel._id}_cancel_${timestamp}`;

      const newMess = {
        notificationId: notificationId,
        orderId: mess.checkOrderIDCancel._id,
        data: mess.checkOrderIDCancel,
        type: "cancel_order",
        timestamp: timestamp,
        isRead: false,
      };
      pushNotification(newMess);
    };

    const handleReplyComment = (mess) => {
      const timestamp = Date.now();
      const notificationId = `${mess.commentId._id}_reply_${timestamp}`;

      const newMess = {
        notificationId: notificationId,
        orderId: mess.commentId._id,
        data: {
          ...mess.commentId,
          productId: mess.productId,
        },
        type: "reply_comment",
        timestamp: timestamp,
        isRead: false,
      };
      pushNotification(newMess);
    };

    // HÀM CHUNG LƯU NOTIFICATION
    const pushNotification = (newMess) => {
      setNotifications((prev) => {
        const updated = [newMess, ...prev];
        saveToLocalStorage(updated);
        return updated;
      });

      setNotificationCount((prev) => {
        const current = typeof prev === "number" && !isNaN(prev) ? prev : 0;
        return current + 1;
      });

      setShowBell(true);
    };

    socket.on("confirm_order", handleConfirmOrder);
    socket.on("cancel_order", handleCancelOrder);
    socket.on("reply_comment", handleReplyComment);

    return () => {
      socket.off("confirm_order", handleConfirmOrder);
      socket.off("cancel_order", handleCancelOrder);
      socket.off("reply_comment", handleReplyComment);
    };
  }, [socket, currentUser?.user?._id]);

  // Xem thông báo
  const handleToggleBell = () => {
    setShowBell((prev) => !prev);
  };

  //xem chi tiết 1 thông báo
  const handleNotificationClick = (notification, e) => {
    if (!notification) return;
    e.stopPropagation();
    setShowBell(false);

    //  Sử dụng notificationId thay vì orderId
    setNotifications((prev) => {
      const updated = prev.map((item) =>
        item.notificationId === notification.notificationId
          ? { ...item, isRead: true }
          : item
      );
      saveToLocalStorage(updated);
      return updated;
    });

    // Giảm số lượng thông báo
    setNotificationCount((prev) => Math.max(0, prev - 1));

    // Navigate dựa trên loại thông báo (dùng orderId)
    if (notification.type === "reply_comment") {
      const productId = notification.data?.productId;
      if (productId) {
        navigate(`/product/${productId}`);
      }
    } else if (notification.type === "confirm_order") {
      navigate(`/orderID/${notification.orderId}`);
    } else if (notification.type === "cancel_order") {
      navigate(`/orderID/${notification.orderId}`);
    }
  };

  // Xóa 1 thông báo bằng nút X
  const handleRemoveNotification = (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();

    //Sử dụng notificationId thay vì orderId
    setNotifications((prev) => {
      const updated = prev.filter((i) => i.notificationId !== notificationId);
      saveToLocalStorage(updated);
      return updated;
    });

    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  // Xóa toàn bộ thông báo
  const handleClearAll = () => {
    setNotifications([]);
    setNotificationCount(0);

    const notificationKey = getStorageKey("client_notifications");
    const countKey = getStorageKey("client_notification_count");

    if (notificationKey && countKey) {
      localStorage.removeItem(notificationKey);
      localStorage.removeItem(countKey);
    }
  };

  // Reset state khi client logout (nhưng KHÔNG xóa localStorage)
  useEffect(() => {
    const resetNoti = () => {
      console.log("🔄 Resetting notification state on logout...");
      setNotifications([]);
      setNotificationCount(0);
      setShowBell(false);
    };

    window.addEventListener("client_logout", resetNoti);

    return () => {
      window.removeEventListener("client_logout", resetNoti);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <button onClick={handleToggleBell} className="mt-2 relative">
          <Bell
            size={20}
            className={notificationCount > 0 ? " animate-pulse" : ""}
          />
          {notificationCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg animate-bounce">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
        {showBell && (
          <>
            <div className="flex inset-0 z-40" onClick={handleToggleBell}>
              <div className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                <div className=" bg-gradient-to-r from-orange-500 to-red-500 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-white">
                      <Bell size={20} />
                      Thông báo gần đây
                      {notificationCount > 0 && (
                        <span className="bg-white text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
                          {notificationCount}
                        </span>
                      )}
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-xs text-white hover:underline opacity-90  hover:opacity-100 transition"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((nor) => (
                        <div
                          key={nor.notificationId}
                          className="relative group"
                        >
                          <button
                            onClick={(e) => handleNotificationClick(nor, e)}
                            className="w-full block p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 text-left"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md  group-hover:scale-110 transition-transform">
                                <ShoppingCart
                                  size={18}
                                  className="text-white "
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-sm mb-1">
                                  FashionHub thông báo
                                </p>
                                {nor.type === "reply_comment" && (
                                  <div className="space-y-1">
                                    <p className="font-semibold text-sm text-gray-800">
                                      Bạn có phản hồi mới từ sản phẩm
                                    </p>
                                    <p className="justify-between  text-orange-600 text-xs font-semibold flex  items-center gap-1  group-hover:gap-2 transition-all">
                                      <span className="group-hover:translate-x-1 transition-transform">
                                        Xem chi tiết thông báo →
                                      </span>
                                      <span className="">
                                        {nor.isRead === true
                                          ? "Đã xem"
                                          : "Chưa xem"}
                                      </span>
                                    </p>
                                    <span className="text-sm font-semibold text-blue-500">
                                      {formatDateTime(nor.timestamp)}
                                    </span>
                                  </div>
                                )}
                                {nor.type === "confirm_order" && (
                                  <div className="space-y-1">
                                    <p className="font-semibold text-sm text-gray-800">
                                      Đơn hàng của bạn {nor.orderStatus}
                                    </p>
                                    <p className="justify-between  text-orange-600 text-xs font-semibold flex  items-center gap-1  group-hover:gap-2 transition-all">
                                      <span className="group-hover:translate-x-1 transition-transform">
                                        Xem chi tiết thông báo →
                                      </span>
                                      <span className="">
                                        {nor.isRead === true
                                          ? "Đã xem"
                                          : "Chưa xem"}
                                      </span>
                                    </p>
                                    <span className="text-sm font-semibold text-blue-500">
                                      {formatDateTime(nor.timestamp)}
                                    </span>
                                  </div>
                                )}
                                {nor.type === "cancel_order" && (
                                  <div className="space-y-1">
                                    <p className="font-semibold text-sm text-gray-800">
                                      Đơn hàng của bạn đã bị hủy{" "}
                                    </p>
                                    <p className="justify-between  text-orange-600 text-xs font-semibold flex  items-center gap-1  group-hover:gap-2 transition-all">
                                      <span className="group-hover:translate-x-1 transition-transform">
                                        Xem chi tiết thông báo →
                                      </span>
                                      <span className="">
                                        {nor.isRead === true
                                          ? "Đã xem"
                                          : "Chưa xem"}
                                      </span>
                                    </p>
                                    <span className="text-sm font-semibold text-blue-500">
                                      {formatDateTime(nor.timestamp)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </div>
                          </button>
                          {/* Nút X để xóa */}
                          <button
                            className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-bold z-10"
                            title="Xóa thông báo"
                            onClick={(e) =>
                              handleRemoveNotification(e, nor.notificationId)
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Không có thông báo nào
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Các thông báo mới sẽ hiển thị tại đây
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Notification;
