import React, { useState, useEffect } from 'react';
import { 
    CloseOutlined, UserOutlined, LockOutlined, 
    EyeInvisibleOutlined, EyeOutlined, IdcardOutlined, 
    MailOutlined, NumberOutlined, ArrowLeftOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const AuthModal = () => {
    const { closeModal, login, initialMode } = useAuth();
    
    const [view, setView] = useState('login'); 
    
    const [forgotStep, setForgotStep] = useState(1); 

    // Timer cho OTP
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const [formData, setFormData] = useState({
        username: '', password: '', fullName: '', email: '', otp: '', newPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setView(initialMode);
        resetForm();
    }, [initialMode]);

    // Đếm ngược 60s
    useEffect(() => {
        let interval;
        if (view === 'forgot' && forgotStep === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, view, forgotStep]);

    const resetForm = () => {
        setError('');
        setFormData({ username: '', password: '', fullName: '', email: '', otp: '', newPassword: '' });
        setShowPassword(false);
        setForgotStep(1);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- XỬ LÝ LOGIN / REGISTER ---
    const handleLoginRegister = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message);

            if (view === 'register') {
                alert("Đăng ký thành công! Hãy đăng nhập.");
                setView('login');
            } else {
                login(data.user, data.token);
            }
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    // --- XỬ LÝ QUÊN MẬT KHẨU ---

    // Gửi Email
    const handleSendOtp = async (e) => {
        if(e) e.preventDefault();
        setError(''); 
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            
            const data = await res.json();
            
            // Nếu Backend trả về 200 (như code trên), dòng này sẽ qua
            if (!res.ok) throw new Error(data.message);
            
            // 👇 Frontend nhận tín hiệu thành công -> Chuyển sang màn hình OTP
            // Lúc này đồng hồ 60s sẽ tự chạy (do logic useEffect timer)
            alert(data.message); // Hiện thông báo "Gửi OTP thành công..."
            setForgotStep(2);
            setTimer(60);
            setCanResend(false);
        } catch (err) { 
            setError(err.message); 
        }
        setLoading(false);
    };

    // Xác thực OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setForgotStep(3);
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    // Đổi mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    otp: formData.otp, 
                    newPassword: formData.newPassword 
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            alert("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
            setView('login');
            resetForm();
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] animate-fade-in backdrop-blur-sm">
            <div className="bg-[#1f1f1f] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-700 relative">
                
                {/* Nút tắt */}
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-full"><CloseOutlined className="text-xl" /></button>

                {/* --- HEADER --- */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
                        {view === 'login' && 'Login'}
                        {view === 'register' && 'Register'}
                        {view === 'forgot' && 'Reset Password'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {view === 'login' && 'Welcome back to MoiMovies!'}
                        {view === 'register' && 'Create an account to join us!'}
                        {view === 'forgot' && forgotStep === 1 && 'Enter your email to receive OTP.'}
                        {view === 'forgot' && forgotStep === 2 && 'Enter the 6-digit code sent to your email.'}
                        {view === 'forgot' && forgotStep === 3 && 'Enter your new password.'}
                    </p>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">{error}</div>}

                {/* --- FORM --- */}
                {(view === 'login' || view === 'register') && (
                    <form onSubmit={handleLoginRegister} className="space-y-5">
                        {view === 'register' && (
                            <>
                                <div className="relative group">
                                    <IdcardOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="Full Name" required />
                                </div>
                                <div className="relative group">
                                    <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="Email Address" required />
                                </div>
                            </>
                        )}
                        <div className="relative group">
                            <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="Username" required />
                        </div>
                        <div className="relative group">
                            <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-12 text-white focus:border-red-500 outline-none transition" placeholder="Password" required />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center text-xs px-1 pt-2">
                            {view === 'login' ? (
                                <>
                                    <span onClick={() => { setView('forgot'); setForgotStep(1); setError(''); }} className="text-gray-400 hover:text-red-500 cursor-pointer transition">
                                        Forgot Password?
                                    </span>
                                    <span className="text-gray-400">
                                        No account? <strong onClick={() => { setView('register'); setError(''); }} className="text-white hover:text-red-500 hover:underline cursor-pointer ml-1 transition">Register now</strong>
                                    </span>
                                </>
                            ) : (
                                <div className="w-full text-right">
                                    <span className="text-gray-400">
                                        Have an account? <strong onClick={() => { setView('login'); setError(''); }} className="text-white hover:text-red-500 hover:underline cursor-pointer ml-1 transition">Login</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-3 rounded-xl mt-4 transition shadow-lg disabled:opacity-50">
                            {loading ? 'Processing...' : (view === 'login' ? 'Login Now' : 'Create Account')}
                        </button>
                    </form>
                )}

                {/* --- QUÊN MẬT KHẨU --- */}
                {view === 'forgot' && (
                    <div className="space-y-5">
                        
                        {/* NHẬP EMAIL */}
                        {forgotStep === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <div className="relative group">
                                    <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="Enter your email" required />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">{loading ? 'Sending...' : 'Send OTP'}</button>
                            </form>
                        )}

                        {/* NHẬP OTP */}
                        {forgotStep === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <div className="text-center mb-4">
                                    <span className="text-white text-3xl font-mono tracking-widest bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                                        {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-2">Time remaining</p>
                                </div>

                                <div className="relative group">
                                    <NumberOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                                    <input type="text" name="otp" value={formData.otp} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="Enter 6-digit OTP" required />
                                </div>
                                
                                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">{loading ? 'Verifying...' : 'Verify OTP'}</button>
                                
                                {/* Nút Gửi lại mã */}
                                <div className="text-center">
                                    <button 
                                        type="button" 
                                        onClick={handleSendOtp} 
                                        disabled={!canResend || loading} 
                                        className={`text-xs ${canResend ? 'text-red-500 hover:underline cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* MẬT KHẨU MỚI */}
                        {forgotStep === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="relative group">
                                    <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-red-500 outline-none transition" placeholder="New Password" required />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">{loading ? 'Updating...' : 'Update Password'}</button>
                            </form>
                        )}

                        <div className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:text-white flex justify-center items-center gap-1" onClick={() => setView('login')}>
                            <ArrowLeftOutlined /> Back to Login
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AuthModal;