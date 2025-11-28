import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import ListSkeleton from '../skeletons/ListSkeleton'; // Import Skeleton

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Logic gọi API: Chỉ lấy Trending TV (Không còn logic search ở đây)
  const fetchSeries = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await tmdbApi.getTrendingTV(pageNumber);
      
      if (response) {
          setSeries(response.results || []);
          // Giới hạn 500 trang theo quy định của TMDB
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
    
    // Thêm delay nhỏ nếu muốn skeleton hiện lâu hơn chút, hoặc tắt ngay
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSeries(page);
  }, [page]);

  // 👇 EARLY RETURN: Trả về Skeleton nếu đang loading
  if (loading) {
      return <ListSkeleton />;
  }

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        Trending TV Series
      </h2>

      {/* Grid hiển thị phim */}
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
      
      {/* Thông báo nếu danh sách rỗng (hiếm khi xảy ra với Trending) */}
      {!loading && series.length === 0 && (
          <div className="text-center w-full mt-10 text-gray-400 text-lg">
              No series found.
          </div>
      )}

      {/* Pagination */}
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