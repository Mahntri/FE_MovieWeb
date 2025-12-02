import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const UserTable = ({ users, onDelete }) => {
  return (
    <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 overflow-hidden shadow-lg min-h-[400px]">
        <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-400 uppercase text-xs font-bold">
                <tr>
                    <th className="p-4">Username</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Ngày tham gia</th>
                    <th className="p-4 text-right">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {users.map(acc => (
                    <tr key={acc._id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-bold text-white">{acc.username}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${acc.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {acc.role}
                            </span>
                        </td>
                        <td className="p-4 text-gray-400">{new Date(acc.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                            {acc.role !== 'ADMIN' && (
                                <button 
                                    onClick={() => onDelete(acc._id)} 
                                    className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-sm transition"
                                >
                                    <DeleteOutlined /> Xóa
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                {users.length === 0 && (
                    <tr><td colSpan="4" className="p-10 text-center text-gray-500">Không có dữ liệu.</td></tr>
                )}
            </tbody>
        </table>
    </div>
  );
};

export default UserTable;