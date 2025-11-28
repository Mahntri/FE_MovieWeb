import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 mx-1 rounded-md font-bold transition-all duration-200 border border-gray-700
            ${currentPage === i 
              ? 'bg-red-700 text-white border-red-700 shadow-lg shadow-red-900/50 scale-110' 
              : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10 mb-10 select-none">
      
      {/* 1. Hiển thị thông tin trang */}
      <div className="bg-gray-900 text-gray-400 font-semibold px-4 py-2 rounded-md border border-gray-700">
        Trang <span className="text-white font-bold">{currentPage}</span> của <span className="text-white font-bold">{totalPages}</span>
      </div>

      {/* 2. Các nút điều hướng */}
      <div className="flex items-center gap-1">
        
        {/* Nút TRANG ĐẦU*/}
        {currentPage > 3 && (
            <button 
                onClick={() => onPageChange(1)} 
                className="px-4 py-2 bg-gray-900 text-gray-400 font-semibold rounded-md border border-gray-700 hover:bg-gray-700 hover:text-white transition"
            >
                Trang Đầu
            </button>
        )}

        {renderPageNumbers()}

        {/* Nút TRANG CUỐI*/}
        {currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-gray-900 text-gray-400 font-semibold rounded-md border border-gray-700 hover:bg-gray-700 hover:text-white transition"
          >
            Trang Cuối
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;