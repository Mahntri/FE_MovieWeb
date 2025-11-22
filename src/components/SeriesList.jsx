import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination'; // 👈 Import component Pagination

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 👈 Thêm state tổng số trang
  
  // State tìm kiếm
  const [keyword, setKeyword] = useState(''); 
  const [searchQuery, setSearchQuery] = useState(''); 
  
  const [loading, setLoading] = useState(false);

  // Hàm gọi API chung cho cả Tìm kiếm và Trending
  const fetchSeries = async (pageVal, query) => {
    setLoading(true);
    let response = null;

    try {
      if (query.trim() === '') {
        // Nếu không tìm kiếm -> Lấy danh sách thịnh hành
        response = await tmdbApi.getTrendingTV(pageVal);
      } else {
        // Nếu có từ khóa -> Gọi API tìm kiếm
        response = await tmdbApi.searchTV(query, pageVal);
      }

      // Cập nhật dữ liệu
      if (response) {
          setSeries(response.results); // Thay thế danh sách cũ bằng trang mới
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages); // Giới hạn 500 trang
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
    
    setLoading(false);
    // Cuộn lên đầu trang mỗi khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // useEffect kích hoạt khi 'page' hoặc 'searchQuery' thay đổi
  useEffect(() => {
    fetchSeries(page, searchQuery);
  }, [page, searchQuery]);

  // Xử lý khi bấm nút Search
  const handleSearch = () => {
    if (keyword.trim() !== searchQuery) { // Chỉ tìm nếu từ khóa thay đổi
        setSearchQuery(keyword); 
        setPage(1); // Reset về trang 1
    }
  };
  
  // Xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  }

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        {searchQuery ? `Search Results: "${searchQuery}"` : "Trending TV Series"}
      </h2>

      {/* Thanh tìm kiếm
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter keyword..."
          className="px-4 py-2 w-64 rounded-l-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-red-500 transition-colors"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          onClick={handleSearch}
          className="px-5 py-2 bg-red-600 text-white rounded-r-full hover:bg-red-700 transition shadow-lg hover:shadow-red-500/50"
        >
          Search
        </button>
      </div> */}

      {/* Hiển thị Loading hoặc Danh sách */}
      {loading ? (
        <div className="h-96 flex items-center justify-center text-xl text-gray-400">Loading series...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {series.map((item) => (
            <MovieCard
              key={item.id}
              movie={null}
              tv={item.name || item.original_name} // Ưu tiên tên series
              img={item.poster_path}
              id={item.id}
            />
          ))}
        </div>
      )}
      
      {/* Thông báo nếu không tìm thấy */}
      {!loading && series.length === 0 && (
          <div className="text-center w-full mt-10 text-gray-400 text-lg">
              No series found.
          </div>
      )}

      {/* 👇 Component Pagination 👇 */}
      {!loading && series.length > 0 && (
        <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
        />
      )}
      
      <div className="mb-10"></div>
    </div>
  );
};

export default SeriesList;