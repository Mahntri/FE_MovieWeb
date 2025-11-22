import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination'; // 👈 Import Pagination

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 👈 Thêm state tổng số trang
  const [loading, setLoading] = useState(false);

  // Logic gọi API
  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    try {
      // Vì tmdbApi giờ trả về object { results, total_pages }
      const response = await tmdbApi.getTopRatedMovies(pageNumber);
      
      setMovies(response.results); // Thay thế danh sách phim
      setTotalPages(response.total_pages > 500 ? 500 : response.total_pages); // TMDB giới hạn page 500
    } catch (error) {
      console.log('Error fetching movies', error);
    }
    setLoading(false);
    
    // Cuộn lên đầu trang mỗi khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        Top Rated Movies
      </h2>

      {loading ? (
        <div className="h-96 flex items-center justify-center text-xl">Loading data...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie.title}
              img={movie.poster_path}
              id={movie.id}
            />
          ))}
        </div>
      )}

      {/* 👇 Thay thế nút Load More bằng Pagination 👇 */}
      {!loading && (
        <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
        />
      )}
      
      <div className="mb-10"></div>
    </div>
  );
};

export default MovieList;