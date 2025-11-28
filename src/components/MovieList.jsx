import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import ListSkeleton from '../skeletons/ListSkeleton'; // Import Skeleton

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Logic gọi API: Chỉ lấy Top Rated Movies (Không còn search)
  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await tmdbApi.getTopRatedMovies(pageNumber);
      
      if (response) {
          setMovies(response.results || []);
          // Giới hạn 500 trang theo quy định của TMDB
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // 👇 EARLY RETURN: Trả về Skeleton nếu đang loading
  if (loading) {
    return <ListSkeleton />;
  }

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        Top Rated Movies
      </h2>

      {/* Grid hiển thị phim */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie.title} // Truyền title cho MovieCard
            img={movie.poster_path}
            id={movie.id}
          />
        ))}
      </div>

      {/* Thông báo nếu danh sách rỗng */}
      {!loading && movies.length === 0 && (
          <div className="text-center w-full mt-10 text-gray-400 text-lg">
              No movies found.
          </div>
      )}

      {/* Pagination */}
      {!loading && movies.length > 0 && (
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