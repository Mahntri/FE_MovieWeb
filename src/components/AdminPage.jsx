import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [activeTab, setActiveTab] = useState('users');
    const [accounts, setAccounts] = useState([]);
    const [reportedComments, setReportedComments] = useState([]);

    // Kiểm tra quyền Admin
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
    }, [user]);

    // Lấy dữ liệu
    const fetchData = async () => {
        try {
            if (activeTab === 'users') {
                const res = await fetch('http://localhost:3000/api/admin/accounts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.data) setAccounts(data.data);
            } else {
                const res = await fetch('http://localhost:3000/api/comments/admin/reported', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.data) setReportedComments(data.data);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu admin:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    // Xử lý xóa User
    const handleDeleteUser = async (id) => {
        if(!confirm("Xóa tài khoản này sẽ mất hết dữ liệu. Tiếp tục?")) return;
        await fetch(`http://localhost:3000/api/admin/accounts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
    };

    // Xử lý xóa Comment
    const handleDeleteComment = async (id) => {
        if(!confirm("Xóa bình luận này?")) return;
        await fetch(`http://localhost:3000/api/comments/admin/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
    };

    // Xử lý bỏ qua báo cáo
    const handleDismissReport = async (id) => {
        await fetch(`http://localhost:3000/api/comments/admin/${id}/dismiss`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
    };

    return (
        <div className="pt-28 px-6 min-h-screen bg-[#121212] text-white pb-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-red-600">ADMIN DASHBOARD</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-700">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`pb-3 px-4 font-bold ${activeTab === 'users' ? 'text-white border-b-2 border-red-600' : 'text-gray-500'}`}
                    >
                        Quản lý Tài khoản
                    </button>
                    <button 
                        onClick={() => setActiveTab('comments')}
                        className={`pb-3 px-4 font-bold ${activeTab === 'comments' ? 'text-white border-b-2 border-red-600' : 'text-gray-500'}`}
                    >
                        Bình luận bị báo cáo ({reportedComments.length})
                    </button>
                </div>

                {/* Users */}
                {activeTab === 'users' && (
                    <div className="bg-[#1f1f1f] rounded-lg overflow-hidden border border-gray-800">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Joined Date</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(acc => (
                                    <tr key={acc._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                        <td className="p-4 font-bold">{acc.username}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${acc.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                                {acc.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{new Date(acc.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            {acc.role !== 'ADMIN' && (
                                                <button onClick={() => handleDeleteUser(acc._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition">
                                                    <DeleteOutlined /> Xóa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Comments */}
                {activeTab === 'comments' && (
                    <div className="space-y-4">
                        {reportedComments.length === 0 && <p className="text-gray-500">Không có bình luận nào bị báo cáo.</p>}
                        {reportedComments.map(cmt => (
                            <div key={cmt._id} className="bg-[#1f1f1f] p-4 rounded-lg border border-red-900/50 flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                    <img src={cmt.userId?.avatar || "https://animevietsub.show/statics/images/user-image.png"} className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-red-400">{cmt.userId?.fullName}</span>
                                        <span className="text-xs text-gray-500">{new Date(cmt.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-300 mt-2 bg-black/30 p-3 rounded border border-gray-700">
                                        "{cmt.content}"
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        ID Phim: {cmt.mediaId} ({cmt.mediaType})
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => handleDeleteComment(cmt._id)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1 w-24 justify-center"
                                    >
                                        <DeleteOutlined /> Xóa
                                    </button>
                                    <button 
                                        onClick={() => handleDismissReport(cmt._id)}
                                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm flex items-center gap-1 w-24 justify-center"
                                    >
                                        <CheckCircleOutlined /> Bỏ qua
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;