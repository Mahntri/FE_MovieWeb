import React, { useState, useEffect } from 'react';
import { 
    CloseOutlined, 
    UserOutlined, 
    LockOutlined, 
    EyeInvisibleOutlined, 
    EyeOutlined,
    IdcardOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
    const { closeModal, login, initialMode } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    
    // Form Data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setIsLogin(initialMode === 'login');
        setError('');
        setFormData({ username: '', password: '', fullName: '' });
        setShowPassword(false);
    }, [initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const res = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (!isLogin) {
                alert("Đăng ký thành công! Hãy đăng nhập.");
                setIsLogin(true);
                setLoading(false);
            } else {
                login(data.user, data.token);
            }

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const switchMode = (mode) => {
        setIsLogin(mode);
        setError('');
        setFormData({ username: '', password: '', fullName: '' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] animate-fade-in backdrop-blur-sm">
            <div className="bg-[#1f1f1f] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-700 relative">
                
                {/* Nút tắt */}
                <button 
                    onClick={closeModal} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-full"
                >
                    <CloseOutlined className="text-xl" />
                </button>

                {/* Header: Chỉ còn Tiêu đề */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
                        {isLogin ? 'Login' : 'Register'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'Welcome back to MoiMovies!' : 'Create an account to join us!'}
                    </p>
                </div>

                {/* Thông báo lỗi */}
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Input FullName (Chỉ hiện khi Đăng ký) */}
                    {!isLogin && (
                        <div className="relative group">
                            <IdcardOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition" />
                            <input 
                                type="text" name="fullName" 
                                value={formData.fullName} onChange={handleChange}
                                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition shadow-inner placeholder-gray-500" 
                                placeholder="Full Name"
                                required 
                            />
                        </div>
                    )}

                    {/* Input Username */}
                    <div className="relative group">
                        <UserOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition" />
                        <input 
                            type="text" name="username"
                            value={formData.username} onChange={handleChange}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition shadow-inner placeholder-gray-500" 
                            placeholder="Username"
                            required 
                        />
                    </div>

                    {/* Input Password */}
                    <div className="relative group">
                        <LockOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            value={formData.password} onChange={handleChange}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-12 text-white focus:border-red-500 outline-none transition shadow-inner placeholder-gray-500" 
                            placeholder="Password"
                            required 
                        />
                        <div 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer transition"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </div>
                    </div>

                    {/* Footer Links: Chuyển đổi mode ở đây */}
                    <div className="flex justify-between items-center text-xs px-1 pt-2">
                        {isLogin ? (
                            <>
                                <span className="text-gray-400 hover:text-red-500 cursor-pointer transition">
                                    Forgot Password?
                                </span>
                                <span className="text-gray-400">
                                    No account? <strong onClick={() => switchMode(false)} className="text-white hover:text-red-500 hover:underline cursor-pointer ml-1 transition">Register now</strong>
                                </span>
                            </>
                        ) : (
                            <div className="w-full text-right">
                                <span className="text-gray-400">
                                    Have an account? <strong onClick={() => switchMode(true)} className="text-white hover:text-red-500 hover:underline cursor-pointer ml-1 transition">Login</strong>
                                </span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-3 rounded-xl mt-4 transition shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;