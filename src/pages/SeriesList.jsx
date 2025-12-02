import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard';
import Pagination from '../components/common/Pagination';
import ListSkeleton from '../components/skeletons/ListSkeleton'; 
import useDocumentTitle from '../hooks/useDocumentTitle';

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useDocumentTitle('TV Series - MoiMovies');
  
  // 1. Hook quản lý URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const fetchSeries = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await tmdbApi.getTrendingTV(pageNumber);
      
      if (response) {
          setSeries(response.results || []);
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
    
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSeries(page);
  }, [page]);

  // 👇 2. THÊM HÀM NÀY ĐỂ XỬ LÝ CHUYỂN TRANG
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (loading) {
      return <ListSkeleton />;
  }

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        Trending TV Series
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {series.map((item) => (
            <MovieCard
              key={item.id}
              movie={null}
              tv={item.name || item.original_name}
              img={item.poster_path}
              id={item.id}
            />
          ))}
      </div>
      
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
            // 👇 SỬA LẠI DÒNG NÀY: Dùng handlePageChange thay vì setPage
            onPageChange={handlePageChange} 
        />
      )}
      
      <div className="mb-10"></div>
    </div>
  );
};

export default SeriesList;