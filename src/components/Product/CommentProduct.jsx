import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CommentList from "./CommentList";
import { message, Modal } from "antd";
import Input from "../Ui/Input";

function CommentProduct() {
  const [openGuest, setOpenGuest] = useState(false);
  const [question, setQuestion] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [guest, setGuest] = useState("");
  const userID = useSelector((state) => state.user?.currentUser);
  const getComments = async () => {
    try {
      const res = await axiosInstance.get(`/v1/user/comment/getComment/${id}`);
      if (res.data.success) {
        setComments(res.data.formatted);
        console.log(res.data);
      }
    } catch (error) {
      setComments([]);
    }
  };
  // create and update comment
  const handleCreateComment = async () => {
    try {
      if (!question.trim()) {
        messageApi.error("Hãy nhập nội dung");
        return;
      }
      if (!userID && !guest.trim()) {
        setOpenGuest(true);
        return;
      }
      // nếu đang sửa comment
      if (editingComment) {
        try {
          const res = await axiosInstance.patch(
            `/v1/user/comment/${editingComment._id}`,
            {
              question: question.trim(),
            }
          );
          if (res.data.success) {
            messageApi.success("Cập nhật comment thành công");
            setQuestion("");
            setEditingComment(null);
            await getComments();
            return;
          }
        } catch (error) {
          messageApi.error("Không thể sửa bình luận này");
          return;
        }
      }
      const data = {
        question: question.trim(),
      };
      if (!userID) {
        // data.guestName từ be
        data.guestName = guest.trim();
      }
      const res = await axiosInstance.post(
        `/v1/user/comment/createComment/${id}`,
        data
      );
      if (res.data.success) {
        messageApi.success("Thêm bình luận thành công");
        setQuestion("");
        await getComments();
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Lỗi server");
    }
  };
  useEffect(() => {
    getComments();
  }, [id]);
  return (
    <>
      {contextHolder}
      <div className="mt-10 w-full flex justify-center ">
        {/* enter comment */}
        <div className="w-[90%]  bg-white border rounded-2xl  p-5 mb-4">
          <h1 className="text-xl text-gray-700 font-bold mb-4 border-b pb-2">
            Bình luận ({comments?.length > 0 ? comments.length : 0})
          </h1>

          <div className="w-full">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                //  !e.shiftKey để khi người dùng giữ Shift + Enter thì vẫn có thể xuống dòng.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateComment();
                }
              }}
              className="w-full min-h-[100px] rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none"
              placeholder="Viết bình luận của bạn..."
            ></textarea>

            <div className="flex justify-end mt-3 ml-2">
              <div className="flex items-center gap-2 mt-3">
                {editingComment && (
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setQuestion("");
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md 
                 hover:bg-gray-200 hover:text-gray-800 active:scale-95 transition"
                  >
                    Hủy
                  </button>
                )}

                <button
                  onClick={handleCreateComment}
                  className={`px-3 py-1 text-sm rounded-md font-medium text-white 
      ${
        editingComment
          ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-blue-600 hover:bg-blue-700"
      } 
      active:scale-95 transition`}
                >
                  {editingComment ? "Cập nhật" : "Gửi"}
                </button>
              </div>
            </div>
          </div>
          {/* comment list */}
          <CommentList
            getComments={getComments}
            userID={userID}
            comments={comments}
            setGuest={setGuest}
            guest={guest}
            setOpenGuest={setOpenGuest}
            editingComment={editingComment}
            onEditComment={(comment) => {
              setQuestion(comment.question);
              setEditingComment(comment);
            }}
          />
        </div>
      </div>

      <Modal
        title={null} // tắt title mặc định để custom
        closable
        open={openGuest}
        onCancel={() => setOpenGuest(false)}
        onOk={() => {
          if (!guest.trim()) {
            messageApi.error("Hãy nhập tên để bình luận");
            return;
          }
          setOpenGuest(false);
          // handleCreateComment();
        }}
        width={600}
        okButtonProps={{ style: { display: "none" } }} // ẩn nút OK
        cancelText="Đồng ý"
        className="rounded-2xl overflow-hidden"
      >
        {/* Header tùy chỉnh */}
        <div className="text-center mb-6"></div>
        <div>
          <label htmlFor=""> Nhập tên của bạn để bình luận nhé</label>
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setOpenGuest(false);
                handleCreateComment();
              }
            }}
            className="style_address"
            onChange={(e) => setGuest(e.target.value)}
          />
        </div>

        {/* Nội dung danh sách voucher */}
      </Modal>
    </>
  );
}

export default CommentProduct;
