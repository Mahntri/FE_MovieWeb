import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Xử lý logic đăng nhập tại đây
        // Ví dụ: gọi API xác thực
        console.log('Username:', username);
        console.log('Password:', password);
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-red-500">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-red-500 hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;