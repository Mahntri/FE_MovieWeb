import React from 'react';
import { CheckCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';

const ReportTable = ({ reports, onResolve }) => {
  if (reports.length === 0) {
    return (
        <div className="text-center py-20 text-gray-500 bg-[#1f1f1f] rounded-xl border border-gray-800">
            <CheckCircleOutlined className="text-4xl mb-2 text-green-500"/>
            <p>Hệ thống hoạt động tốt! Không có báo lỗi nào.</p>
        </div>
    );
  }

  return (
    <div className="space-y-2">
        {reports.map(item => (
            <div key={item._id} className="bg-[#1f1f1f] p-3 rounded-lg border border-yellow-600/30 flex gap-3 items-center shadow-sm hover:border-yellow-500 transition">
                
                {/* Icon đại diện */}
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-yellow-500 text-sm flex-shrink-0">
                    <VideoCameraOutlined />
                </div>
                
                {/* Nội dung chính */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm truncate max-w-[200px] md:max-w-xs" title={item.title}>
                            {item.title}
                        </h4>
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 rounded border border-gray-700 whitespace-nowrap">
                            {item.mediaType === 'movie' ? 'Movie' : 'TV'}
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:inline-block ml-auto md:ml-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-red-400 text-sm font-medium truncate max-w-[300px]" title={item.description}>
                            Lỗi: "{item.description}"
                        </span>
                        <span className="text-[10px] text-gray-500 hidden md:inline-block">
                            • Báo bởi: {item.userId?.username || "Unknown"}
                        </span>
                        <span className="text-[10px] text-gray-500 hidden md:inline-block">
                            • ID: {item.mediaId}
                        </span>
                    </div>
                </div>

                {/* Nút bấm */}
                <button 
                    onClick={() => onResolve(item._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition shadow-md flex items-center gap-1 flex-shrink-0"
                    title="Xác nhận đã sửa lỗi"
                >
                    <CheckCircleOutlined /> <span className="hidden md:inline">Đã sửa</span>
                </button>
            </div>
        ))}
    </div>
  );
};

export default ReportTable;