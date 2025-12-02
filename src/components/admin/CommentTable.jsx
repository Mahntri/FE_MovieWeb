import React from 'react';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';

const CommentTable = ({ comments, onDelete, onDismiss }) => {
  if (comments.length === 0) {
    return (
        <div className="text-center py-20 text-gray-500 bg-[#1f1f1f] rounded-xl border border-gray-800">
            <CheckCircleOutlined className="text-4xl mb-2 text-green-500"/>
            <p>Tuyệt vời! Không có bình luận nào bị báo cáo.</p>
        </div>
    );
  }

  return (
    <div className="space-y-2"> {/* Giảm khoảng cách giữa các hàng từ space-y-4 xuống 2 */}
        {comments.map(cmt => (
            // 👇 SỬA: p-3 (đệm nhỏ), items-center (căn giữa dọc)
            <div key={cmt._id} className="bg-[#1f1f1f] p-3 rounded-lg border border-red-500/30 flex gap-3 items-center shadow-sm hover:border-red-500 transition">
                
                {/* Avatar nhỏ hơn (w-8 h-8) */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    <img src={cmt.userId?.avatar || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="user"/>
                </div>

                {/* Nội dung */}
                <div className="flex-1 min-w-0"> {/* min-w-0 giúp truncate hoạt động tốt */}
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-red-400 text-sm whitespace-nowrap">{cmt.userId?.fullName || "Unknown"}</span>
                        <span className="text-xs text-gray-500 hidden sm:inline-block">{new Date(cmt.createdAt).toLocaleString()}</span>
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 rounded border border-gray-700 whitespace-nowrap">
                            {cmt.mediaType === 'movie' ? 'Movie ID: ' : 'TV Series ID: '} {cmt.mediaId}
                        </span>
                    </div>
                    
                    {/* Nội dung comment gọn hơn */}
                    <div className="text-gray-300 text-sm mt-0.5 truncate pr-4" title={cmt.content}>
                        {cmt.content}
                    </div>
                </div>

                {/* Nút bấm: Nhỏ gọn, xếp ngang */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                        onClick={() => onDismiss(cmt._id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold transition shadow-md flex items-center gap-1"
                        title="Bỏ qua"
                    >
                        <CheckCircleOutlined /> <span className="hidden md:inline">Bỏ qua</span>
                    </button>
                    <button 
                        onClick={() => onDelete(cmt._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition shadow-md flex items-center gap-1"
                        title="Xóa bỏ"
                    >
                        <DeleteOutlined /> <span className="hidden md:inline">Xóa</span>
                    </button>
                </div>
            </div>
        ))}
    </div>
  );
};

export default CommentTable;