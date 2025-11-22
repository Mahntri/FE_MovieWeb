import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // true: Login tab, false: Register tab

  // Giả lập đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lưu 1 cái token giả vào localStorage để đánh dấu là đã đăng nhập
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', 'UserDemo');
    
    alert(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
    onLoginSuccess(); // Báo cho trang cha biết để cập nhật lại giao diện
    onClose(); // Đóng popup
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-700 relative">
        
        {/* Nút tắt */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <CloseOutlined className="text-xl" />
        </button>

        {/* Tabs chuyển đổi */}
        <div className="flex border-b border-gray-700 mb-6">
            <button 
                className={`flex-1 pb-3 font-bold text-lg ${isLogin ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setIsLogin(true)}
            >
                Login
            </button>
            <button 
                className={`flex-1 pb-3 font-bold text-lg ${!isLogin ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setIsLogin(false)}
            >
                Register
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                    <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-red-500 outline-none" required />
                </div>
            )}
            <div>
                <label className="block text-gray-400 text-sm mb-1">Username</label>
                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-red-500 outline-none" required />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-1">Password</label>
                <input type="password" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-red-500 outline-none" required />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded mt-4 transition">
                {isLogin ? 'Login to Continue' : 'Create Account'}
            </button>
        </form>
        
        <p className="text-gray-500 text-xs text-center mt-4">
            By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;