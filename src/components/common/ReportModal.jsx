import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { WarningOutlined, CloseOutlined } from '@ant-design/icons';

const ReportModal = ({ isOpen, onClose, onSubmit, title = "Report Issue" }) => {
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!description.trim()) {
            alert("Please describe the issue!");
            return;
        }
        onSubmit(description);
        setDescription('');
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[99999] animate-fade-in backdrop-blur-sm">
            <div className="bg-[#1f1f1f] w-full max-w-md p-6 rounded-xl shadow-2xl border border-gray-700 relative">
                
                {/* Nút tắt */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <CloseOutlined />
                </button>

                <div className="text-center mb-6">
                    <div className="text-yellow-500 text-4xl mb-3">
                        <WarningOutlined />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Please describe the issue in detail so we can fix it as soon as possible!
                    </p>
                </div>

                <textarea 
                    className="w-full bg-[#121212] border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none resize-none h-32 mb-4"
                    placeholder="e.g., Audio missing at 10:00, subtitles out of sync..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                />
                
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-lg font-bold bg-yellow-600 text-white hover:bg-yellow-500 transition shadow-lg"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReportModal;