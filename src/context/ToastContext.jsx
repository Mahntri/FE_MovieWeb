import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  InfoCircleFilled, 
  CloseOutlined 
} from '@ant-design/icons';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const toastConfig = {
    success: {
      icon: <CheckCircleFilled className="text-green-500 text-xl" />,
      borderColor: 'border-green-500',
      progressBar: 'bg-green-500'
    },
    error: {
      icon: <CloseCircleFilled className="text-red-500 text-xl" />,
      borderColor: 'border-red-500',
      progressBar: 'bg-red-500'
    },
    info: {
      icon: <InfoCircleFilled className="text-blue-500 text-xl" />,
      borderColor: 'border-blue-500',
      progressBar: 'bg-blue-500'
    },
    warning: {
      icon: <InfoCircleFilled className="text-yellow-500 text-xl" />,
      borderColor: 'border-yellow-500',
      progressBar: 'bg-yellow-500'
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* TOAST */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const style = toastConfig[toast.type] || toastConfig.info;

          return (
            <div 
              key={toast.id}
              className={`
                pointer-events-auto relative flex items-center gap-3 min-w-[300px] max-w-md p-4 
                bg-[#1f1f1f] text-white rounded-lg shadow-2xl overflow-hidden
                border-l-4 ${style.borderColor} animate-slide-in
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {style.icon}
              </div>

              {/* Nội dung */}
              <div className="flex-1 text-sm font-medium pr-2">
                {toast.message}
              </div>

              {/* Nút tắt nhanh */}
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white transition p-1"
              >
                <CloseOutlined />
              </button>

              {/* THANH THỜI GIAN CHẠY */}
              <div className={`absolute bottom-0 left-0 h-[3px] ${style.progressBar} animate-progress`}></div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const { addToast } = useContext(ToastContext);
  return {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning')
  };
};