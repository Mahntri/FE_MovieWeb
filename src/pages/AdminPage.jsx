import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserTable from '../components/admin/UserTable';
import CommentTable from '../components/admin/CommentTable';
import ReportTable from '../components/admin/ReportTable';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ITEMS_PER_PAGE = 5;

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [activeTab, setActiveTab] = useState('users');
    const [accounts, setAccounts] = useState([]);
    const [reportedComments, setReportedComments] = useState([]);
    const [videoReports, setVideoReports] = useState([]); // State cho báo lỗi phim
    const [currentPage, setCurrentPage] = useState(1);

    useDocumentTitle('Admin Dashboard');

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // 1. Users
            const resAccounts = await fetch('http://localhost:3000/api/admin/accounts', { headers: { 'Authorization': `Bearer ${token}` } });
            const dataAccounts = await resAccounts.json();
            if (dataAccounts.data) setAccounts(dataAccounts.data);

            // 2. Reported Comments
            const resReports = await fetch('http://localhost:3000/api/comments/admin/reported', { headers: { 'Authorization': `Bearer ${token}` } });
            const dataReports = await resReports.json();
            if (dataReports.data) setReportedComments(dataReports.data);

            // 3. Video Reports (Mới)
            const resVideoReports = await fetch('http://localhost:3000/api/reports/admin', { headers: { 'Authorization': `Bearer ${token}` } });
            const dataVideoReports = await resVideoReports.json();
            if (dataVideoReports.data) setVideoReports(dataVideoReports.data);

        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { setCurrentPage(1); }, [activeTab]);

    const handleDeleteUser = async (id) => {
        if(!window.confirm("Xóa tài khoản này?")) return;
        await fetch(`http://localhost:3000/api/admin/accounts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchData();
    };
    const handleDeleteComment = async (id) => {
        if(!window.confirm("Xóa bình luận này?")) return;
        await fetch(`http://localhost:3000/api/comments/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchData();
    };
    const handleDismissReport = async (id) => {
        await fetch(`http://localhost:3000/api/comments/admin/${id}/dismiss`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
        fetchData();
    };
    const handleResolveVideo = async (id) => {
        if(!confirm("Xác nhận đã khắc phục lỗi này?")) return;
        await fetch(`http://localhost:3000/api/reports/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchData();
    };

    // Logic Phân trang & Chọn Data
    let currentData = [];
    if (activeTab === 'users') currentData = accounts;
    else if (activeTab === 'comments') currentData = reportedComments;
    else if (activeTab === 'video_reports') currentData = videoReports;

    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const currentItems = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="pt-20 min-h-screen bg-[#121212] text-white flex">
            {/* 1. SIDEBAR */}
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                reportCount={reportedComments.length} 
                videoReportCount={videoReports.length}
            />

            {/* 2. CONTENT AREA */}
            <div className="flex-1 ml-64 p-8 relative min-h-[calc(100vh-80px)] flex flex-col">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white uppercase">
                        {activeTab === 'users' && 'Danh sách thành viên'}
                        {activeTab === 'comments' && 'Bình luận báo cáo'}
                        {activeTab === 'video_reports' && 'Phim bị báo lỗi'}
                    </h1>
                    <div className="bg-[#1f1f1f] px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-gray-400 text-sm mr-2">Tổng số:</span>
                        <span className="text-xl font-bold text-red-500">{currentData.length}</span>
                    </div>
                </div>

                {/* 3. HIỂN THỊ BẢNG (SỬA LẠI LOGIC ĐIỀU KIỆN CHO RÕ RÀNG) */}
                <div className="flex-1">
                    {activeTab === 'users' && (
                        <UserTable users={currentItems} onDelete={handleDeleteUser} />
                    )}
                    {activeTab === 'comments' && (
                        <CommentTable 
                            comments={currentItems} 
                            onDelete={handleDeleteComment} 
                            onDismiss={handleDismissReport} 
                        />
                    )}
                    {activeTab === 'video_reports' && (
                        <ReportTable 
                            reports={currentItems} 
                            onResolve={handleResolveVideo} 
                        />
                    )}
                </div>

                {/* 4. THANH PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="flex justify-end mt-auto pt-6 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition
                                    ${currentPage === number ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;