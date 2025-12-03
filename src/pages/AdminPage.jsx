import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserTable from '../components/admin/UserTable';
import CommentTable from '../components/admin/CommentTable';
import ReportTable from '../components/admin/ReportTable';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ConfirmModal from '../components/common/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../../src/api/config';

const ITEMS_PER_PAGE = 5;

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const toast = useToast();
    
    const [activeTab, setActiveTab] = useState('users');
    const [accounts, setAccounts] = useState([]);
    const [reportedComments, setReportedComments] = useState([]);
    const [videoReports, setVideoReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    useDocumentTitle('Admin Dashboard - MoiMovies');

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            toast.error("You do not have permission to access this page!");
            navigate('/');
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const resAccounts = await fetch(`${API_BASE_URL}/api/admin/accounts`, { headers: { 'Authorization': `Bearer ${token}` } });
            const dataAccounts = await resAccounts.json();
            if (dataAccounts.data) setAccounts(dataAccounts.data);

            const resReports = await fetch(`${API_BASE_URL}/api/comments/admin/reported`, { headers: { 'Authorization': `Bearer ${token}` } });
            const dataReports = await resReports.json();
            if (dataReports.data) setReportedComments(dataReports.data);

            const resVideoReports = await fetch(`${API_BASE_URL}/api/reports/admin`, { headers: { 'Authorization': `Bearer ${token}` } });
            const dataVideoReports = await resVideoReports.json();
            if (dataVideoReports.data) setVideoReports(dataVideoReports.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { setCurrentPage(1); }, [activeTab]);

    // --- XÓA TÀI KHOẢN ---
    const executeDeleteUser = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/accounts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success("Delete successful.");
                fetchData();
            } else toast.error("Error deleting user.");
        } catch (e) { toast.error("Connection error."); }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    const handleDeleteUser = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete user?",
            message: "This action will permanently delete the user account and related data. Are you sure?",
            onConfirm: () => executeDeleteUser(id)
        });
    };

    // --- XÓA BÌNH LUẬN ---
    const executeDeleteComment = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/comments/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success("Comment deleted.");
                fetchData();
            }
        } catch (e) { console.error(e); }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    const handleDeleteComment = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete comment?",
            message: "Are you sure you want to delete this comment from the system?",
            onConfirm: () => executeDeleteComment(id)
        });
    };
    // --- BỎ QUA BÁO CÁO BÌNH LUẬN ---
    const handleDismissReport = async (id) => {
        await fetch(`${API_BASE_URL}/api/comments/admin/${id}/dismiss`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
        toast.info("Report dismissed.");
        fetchData();
    };

    // --- BÁO LỖI PHIM ---
    const executeResolveVideo = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/reports/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                toast.success("Issue resolved confirmed.");
                fetchData();
            }
        } catch (e) { console.error(e); }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    const handleResolveVideo = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Confirm issue resolution?",
            message: "Do you confirm that the issue with this video has been fixed and want to delete the report?",
            onConfirm: () => executeResolveVideo(id)
        });
    };

    // Logic Phân trang
    let currentData = [];
    if (activeTab === 'users') currentData = accounts;
    else if (activeTab === 'comments') currentData = reportedComments;
    else if (activeTab === 'video_reports') currentData = videoReports;

    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const currentItems = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="pt-20 min-h-screen bg-[#121212] text-white flex">
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                reportCount={reportedComments.length} 
                videoReportCount={videoReports.length}
            />

            <div className="flex-1 ml-64 p-8 relative min-h-[calc(100vh-80px)] flex flex-col">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white uppercase">
                        {activeTab === 'users' ? 'Account List' : (activeTab === 'comments' ? 'Reported Comments' : 'Reported Videos')}
                    </h1>
                    <div className="bg-[#1f1f1f] px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-gray-400 text-sm mr-2">Total:</span>
                        <span className="text-xl font-bold text-red-500">{currentData.length}</span>
                    </div>
                </div>

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

            <ConfirmModal 
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            />
        </div>
    );
};

export default AdminPage;