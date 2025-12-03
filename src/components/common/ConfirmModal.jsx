import React from 'react';
import { WarningOutlined } from '@ant-design/icons';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] animate-fade-in backdrop-blur-sm">
            <div className="bg-[#1f1f1f] w-full max-w-sm p-6 rounded-xl shadow-2xl border border-gray-700 text-center transform transition-all scale-100">
                
                {/* Icon cảnh báo */}
                <div className="mb-4 text-yellow-500">
                    <WarningOutlined style={{ fontSize: '48px' }} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    {message}
                </p>
                
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition min-w-[100px]"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition shadow-lg min-w-[100px]"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;