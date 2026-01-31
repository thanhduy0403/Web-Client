import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { message, Popconfirm } from "antd";
import axiosInstance from "../../axiosInstance";
import { MessageCircleMore, CornerUpLeft, Trash2 } from "lucide-react";
import CommentActions from "../Ui/CommentActions";

function CommentList({
  comments,
  userID,
  getComments,
  guest,
  setOpenGuest,
  onEditComment,
}) {
  const [reply, setReply] = useState("");
  const [visibleComments, setVisibleComments] = useState(2);
  const [messageApi, contextHolder] = message.useMessage();
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  if (!Array.isArray(comments)) return [];

  const handleDeleteComment = async (commentID) => {
    try {
      if (!userID) {
        messageApi.error("Bạn không thể xóa comment này");
        return;
      }
      const res = await axiosInstance.delete(`/v1/user/comment/${commentID}`);
      if (res.data.success) {
        messageApi.success("Xóa comment thành công");
        await getComments();
        return;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error("Bạn không thể xóa comment của người khác");
      } else {
        messageApi.error("Lỗi server");
      }
    }
  };
  const handleDeleteReply = async (commentID, replyID) => {
    try {
      if (!userID) {
        messageApi.error("Bạn không thể xóa phản hồi này");
        return;
      }
      const res = await axiosInstance.delete(
        `/v1/user/comment/${commentID}/reply/${replyID}`
      );
      if (res.data.success) {
        messageApi.success("Xóa phản hồi thành công");
        await getComments();
        return;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error("Bạn không thể xóa phản hồi cuả người khác");
      } else {
        messageApi.error("Lỗi server");
      }
    }
  };
  const startEditReply = (commentID, reply) => {
    setShowReplyInput(commentID); // mở ô nhập ở comment tương ứng
    setEditingReply(reply); // lưu lại reply đang sửa
    setReply(reply.replyText); // đổ nội dung reply vào textarea
  };

  const displayComment = comments.slice(0, visibleComments);
  const handleShowComment = () => {
    setVisibleComments((prev) => prev + 2);
  };

  //  rep and update reply
  const handleReplyComment = async (commentID) => {
    try {
      if (!reply.trim()) {
        messageApi.error("Hãy nhập nội dung phản hồi");
      }
      if (!userID && !guest.trim()) {
        setOpenGuest(true);
        return;
      }
      if (editingReply) {
        try {
          const res = await axiosInstance.patch(
            `/v1/user/comment/${commentID}/reply/${editingReply._id}`,
            { replyText: reply.trim() }
          );
          if (res.data.success) {
            messageApi.success("Cập nhật phản hồi thành công");
            setReply("");
            setEditingReply(null);
            setShowReplyInput(null);
            await getComments();
            return;
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            messageApi.error(error.response.data.message);
            return;
          }
        }
      }
      const data = {
        replyText: reply.trim(),
      };
      if (!userID) {
        data.guestName = guest.trim();
      }
      const res = await axiosInstance.post(
        `/v1/user/comment/reply/${commentID}`,
        data
      );
      if (res.data.success) {
        messageApi.success("Phản hồi thành công");
        setReply("");
        await getComments();
        setShowReplyInput(null);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(error.response.data.message);
        return;
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="mt-2">
        {displayComment.length > 0 ? (
          displayComment.map((cmt) => (
            <div
              key={cmt._id}
              className="bg-white rounded-xl p-4 shadow-sm border mb-3"
            >
              <div className="flex items-start gap-3">
                {/* Avatar người bình luận */}
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-gray-700">
                  {cmt.author.type === "guest"
                    ? cmt.author.guestName.charAt(0).toUpperCase()
                    : cmt.author.username.charAt(0).toUpperCase()}
                </div>

                {/* Nội dung comment */}
                <div className="flex-1">
                  {/* Hàng đầu: tên, thời gian + icon xoá bên phải */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-gray-900 font-semibold">
                        {cmt.author.type === "guest"
                          ? cmt.author.guestName
                          : cmt.author.username}
                      </h1>
                      <span className="text-xs text-gray-500">
                        Bình luận lúc:{" "}
                        {formatDistanceToNow(new Date(cmt.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </div>
                    {/* Menu sửa/xóa */}
                    <CommentActions
                      cmt={cmt}
                      onEdit={onEditComment}
                      onDelete={handleDeleteComment}
                    />
                  </div>

                  {/* Nội dung bình luận */}
                  <p className="mt-1 text-gray-700">{cmt.question}</p>

                  {/* Nút trả lời */}
                  <div className="mt-1">
                    <button
                      className="text-blue-500 text-sm font-medium hover:underline"
                      onClick={() => {
                        setEditingReply(null);
                        setReply("");
                        setShowReplyInput(
                          showReplyInput === cmt._id ? null : cmt._id
                        );
                      }}
                    >
                      {showReplyInput === cmt._id ? "Hủy" : "Trả lời"}
                    </button>
                  </div>

                  {/* Ô nhập phản hồi */}
                  {showReplyInput === cmt._id && (
                    <div className="mt-2">
                      <p className="flex items-center gap-2">
                        <CornerUpLeft size={18} /> Đang trả lời:{" "}
                        <span className="font-medium">
                          {cmt.author.type === "guest"
                            ? cmt.author.guestName
                            : cmt.author.username}
                        </span>
                      </p>

                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplyComment(cmt._id);
                          }
                        }}
                        className="w-full min-h-[70px] rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none"
                        placeholder="Viết phản hồi..."
                      ></textarea>

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setShowReplyInput(null)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleReplyComment(cmt._id)}
                          className={`px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition${
                            editingReply
                              ? "px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                              : ""
                          }`}
                        >
                          {editingReply ? "Cập nhật" : "Gửi"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {cmt.replies.length > 0 && (
                    <div className="mt-4 border-l-2 pl-6 border-gray-200 space-y-3">
                      {cmt.replies.map((rep) => (
                        <div
                          key={rep._id}
                          className="flex items-start gap-3 justify-between"
                        >
                          {/* Trái: Avatar + nội dung */}
                          <div className="flex gap-3 flex-1">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full font-semibold text-blue-800 text-sm">
                              {rep.author.type === "guest"
                                ? rep.author.guestName?.charAt(0).toUpperCase()
                                : rep.author.type === "admin" ||
                                  rep.author.type === "subadmin"
                                ? rep.author.fullname?.charAt(0).toUpperCase()
                                : rep.author.username?.charAt(0).toUpperCase()}
                            </div>

                            <div className="rounded-xl px-2 py-2 flex flex-col">
                              <h1 className="font-semibold text-gray-800 text-sm">
                                {rep.author.type === "guest"
                                  ? rep.author.guestName
                                  : rep.author.type === "admin" ||
                                    rep.author.type === "subadmin"
                                  ? rep.author.fullname
                                  : rep.author.username}{" "}
                                {rep.isOfficialAnswer === true && (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-2">
                                    Quản trị viên
                                  </span>
                                )}
                              </h1>
                              <span className="text-gray-500 text-xs">
                                Trả lời vào{" "}
                                {formatDistanceToNow(new Date(rep.createdAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })}
                              </span>
                              <p className="text-gray-700 text-sm mt-1">
                                <span className="font-medium mr-1 text-gray-950">
                                  @
                                  {cmt.author.type === "guest"
                                    ? cmt.author.guestName
                                    : cmt.author.username}
                                </span>
                                {rep.replyText}
                              </p>
                            </div>
                          </div>
                          {/* Menu sửa/xóa */}
                          <CommentActions
                            cmt={rep}
                            onEdit={() => startEditReply(cmt._id, rep)}
                            onDelete={() => handleDeleteReply(cmt._id, rep._id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="justify-center flex items-center">
            <h1 className="font-semibold text-gray-700 flex gap-2">
              <MessageCircleMore />
              Chưa có bình luận nào cho sản phẩm này
            </h1>
          </div>
        )}
      </div>
      {comments.length > visibleComments && (
        <div className="text-center">
          <button
            onClick={handleShowComment}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Xem thêm bình luận
          </button>
        </div>
      )}
    </>
  );
}

export default CommentList;
