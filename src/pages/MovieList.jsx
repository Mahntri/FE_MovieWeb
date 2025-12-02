import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard'; 
import Pagination from '../components/common/Pagination';
import ListSkeleton from '../components/skeletons/ListSkeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useDocumentTitle('Movies - MoiMovies');

  // 2. Khai báo searchParams để đọc/ghi URL
  const [searchParams, setSearchParams] = useSearchParams();

  // 3. Lấy số trang từ URL. Nếu không có thì mặc định là 1
  const page = parseInt(searchParams.get('page')) || 1;

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await tmdbApi.getTopRatedMovies(pageNumber);
      if (response) {
          setMovies(response.results || []);
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. useEffect sẽ chạy mỗi khi số 'page' trên URL thay đổi
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // 5. Hàm đổi trang: Thay vì set state, ta set URL
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage }); // URL sẽ đổi thành /movie?page=2
  };

  if (loading) return <ListSkeleton />;

  return (
    <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 border-l-4 border-red-600 pl-4 inline-block">
        Top Rated Movies
      </h2>

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

      {!loading && movies.length === 0 && (
          <div className="text-center w-full mt-10 text-gray-400 text-lg">No movies found.</div>
      )}

      {/* Pagination giữ nguyên, chỉ thay đổi hàm handlePageChange ở trên */}
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