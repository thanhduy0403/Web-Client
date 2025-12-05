import React, { useEffect } from "react";
import axiosInstance from "../../axiosInstance";
// Import thẻ tùy chỉnh
import {
  Widget,
  addResponseMessage,
  renderCustomComponent,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

// Component hiển thị thẻ sản phẩm (Đưa component này vào ChatBot.js hoặc file riêng)
const ProductCard = ({ product }) => (
  <a
    href={`/product/${product._id}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "60px",
          height: "60px",
          marginRight: "10px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <div>
        <p style={{ margin: "0", fontWeight: "bold", color: "#333" }}>
          {product.name}
        </p>
        <p style={{ margin: "0", fontSize: "12px", color: "red" }}>
          Giá: {product.price.toLocaleString()}₫
        </p>
      </div>
    </div>
  </a>
);

const ChatBot = () => {
  useEffect(() => {
    addResponseMessage(
      "Xin chào 👋! Hãy mô tả sản phẩm bạn cần để tôi gợi ý nhé."
    );
  }, []);

  const handleNewUserMessage = async (message) => {
    try {
      const res = await axiosInstance.post("v1/user/chat/chatbot", { message });
      const { reply, products } = res.data;

      // 1. Hiển thị tin nhắn văn bản từ AI
      addResponseMessage(reply);

      // 2. Hiển thị danh sách sản phẩm dưới dạng Custom Component sau một độ trễ nhỏ
      if (products && products.length > 0) {
        // Đảm bảo tin nhắn văn bản "Gợi ý sản phẩm" được gửi đi
        setTimeout(() => {
          addResponseMessage("--- Gợi ý Sản Phẩm Đã Tìm Thấy ---");
        }, 10);

        // Gửi các thẻ sản phẩm với độ trễ nhỏ giữa các lần gọi để tránh lỗi parsing
        products.forEach((product, index) => {
          setTimeout(() => {
            // Gắn Custom Component vào widget chat
            renderCustomComponent(ProductCard, { product }, true);
          }, 50 * (index + 1)); // Độ trễ tăng dần 50ms, 100ms, 150ms...
        });
      }
    } catch (error) {
      console.error("Lỗi chatbot:", error);
      addResponseMessage("⚠️ Không thể kết nối đến chatbot.");
    }
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Tư vấn sản phẩm 🛍️"
      subtitle="Chatbot AI"
      // Thêm nút mở/đóng widget (tùy chọn)
      showCloseButton={true}
    />
  );
};

export default ChatBot;
