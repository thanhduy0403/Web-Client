// CommentActions.jsx
import { Popover } from "antd";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";

export default function CommentActions({ cmt, onEdit, onDelete }) {
  const content = (
    <div className="flex flex-col">
      <button
        onClick={() => onEdit(cmt)}
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
      >
        <Edit size={16} /> Sửa
      </button>
      <button
        onClick={() => onDelete(cmt._id)}
        className="flex items-center gap-2 px-2 py-1 text-red-500 hover:bg-gray-100 rounded"
      >
        <Trash2 size={16} /> Xóa
      </button>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <button className="p-1 rounded-full hover:bg-gray-200">
        <EllipsisVertical size={18} />
      </button>
    </Popover>
  );
}
