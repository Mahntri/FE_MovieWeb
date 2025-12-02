import React from 'react';
import { DashboardOutlined, UserOutlined, WarningOutlined, BugOutlined } from '@ant-design/icons';

// 👇 SỬA DÒNG NÀY: Thêm videoReportCount vào trong dấu ngoặc nhọn {}
const AdminSidebar = ({ activeTab, setActiveTab, reportCount, videoReportCount }) => {
  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex-shrink-0 fixed h-full left-0 top-20 bottom-0 z-10">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <DashboardOutlined /> ADMIN
        </h2>
      </div>
      <nav className="mt-4">
        {/* Nút Quản lý tài khoản */}
        <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-red-600/10 text-red-500 border-r-4 border-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
            <UserOutlined className="text-lg" />
            <span className="font-semibold">Quản lý tài khoản</span>
        </button>

        {/* Nút Bình luận báo cáo */}
        <button 
            onClick={() => setActiveTab('comments')}
            className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${activeTab === 'comments' ? 'bg-red-600/10 text-red-500 border-r-4 border-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
            <WarningOutlined className="text-lg" />
            <span className="font-semibold">Bình luận báo cáo</span>
            {reportCount > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {reportCount}
                </span>
            )}
        </button>

        {/* Nút Phim báo lỗi */}
        <button 
            onClick={() => setActiveTab('video_reports')}
            className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${activeTab === 'video_reports' ? 'bg-red-600/10 text-red-500 border-r-4 border-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
            <BugOutlined className="text-lg" />
            <span className="font-semibold">Phim báo lỗi</span>
            {/* 👇 Biến này gây lỗi nếu chưa khai báo ở trên */}
            {videoReportCount > 0 && (
                <span className="ml-auto bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {videoReportCount}
                </span>
            )}
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;