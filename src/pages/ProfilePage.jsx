import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { API_BASE_URL } from '../api/config';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        avatar: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);

    useDocumentTitle('Quản lý tài khoản - MoiMovies');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                fullName: user.fullName || '',
                password: '',
                avatar: user.avatar || ''
            });
            setPreviewImage(user.avatar || "https://animevietsub.show/statics/images/user-image.png");
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            if (formData.password) data.append('password', formData.password);
            if (selectedFile) data.append('avatar', selectedFile);

            const res = await fetch(`${API_BASE_URL}/api/user/update`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();

            if (res.ok) {
                alert("Cập nhật thành công!");
                login(result.data, token); 
            } else {
                alert(result.message || "Lỗi cập nhật");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối server");
        }
        setLoading(false);
    };

    return (
        <div className="pt-28 px-4 min-h-screen flex justify-center bg-[#121212] text-white pb-20">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* ẢNH & INFO */}
                <div className="col-span-1 bg-[#1f1f1f] p-6 rounded-xl h-fit text-center border border-gray-800 shadow-lg">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-700 mb-4 relative group">
                        <img src={previewImage} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{formData.fullName}</h2>
                    <p className="text-gray-400 text-sm mt-1">Member since 2024</p>
                </div>

                {/* FORM CẬP NHẬT */}
                <div className="col-span-2 bg-[#1f1f1f] p-8 rounded-xl border border-gray-800 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">THÔNG TIN TÀI KHOẢN</h3>
                    
                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* Username */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="text-gray-400 font-semibold">Tài khoản</label>
                            <div className="md:col-span-2">
                                <input 
                                    type="text" 
                                    value={formData.username} 
                                    disabled 
                                    className="w-full bg-[#2a2a2a] text-gray-500 border border-gray-700 rounded p-3 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Fullname */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="text-gray-400 font-semibold">Họ tên</label>
                            <div className="md:col-span-2">
                                <input 
                                    type="text" 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded p-3 focus:border-red-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="text-gray-400 font-semibold">Mật khẩu mới</label>
                            <div className="md:col-span-2">
                                <input 
                                    type="password" 
                                    placeholder="Để trống nếu không muốn đổi"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded p-3 focus:border-red-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Avatar Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="text-gray-400 font-semibold">Avatar</label>
                            <div className="md:col-span-2 flex items-center gap-4">
                                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition flex items-center gap-2">
                                    <UploadOutlined /> Chọn tệp
                                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                                </label>
                                <span className="text-sm text-gray-500 italic">
                                    {selectedFile ? selectedFile.name : "Chưa có tệp nào được chọn"}
                                </span>
                            </div>
                        </div>

                        {/* Nút Cập Nhật */}
                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded transition w-full md:w-auto disabled:opacity-50"
                            >
                                {loading ? "Đang cập nhật..." : "CẬP NHẬT"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;