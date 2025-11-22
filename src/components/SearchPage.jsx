import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

const SearchPage = () => {
    const { keyword } = useParams(); // Lấy từ khóa từ URL (ví dụ: /search/batman -> keyword = batman)
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async (pageVal) => {
        setLoading(true);
        try {
            // Gọi API tìm kiếm phim
            const res = await tmdbApi.searchMovie(keyword, pageVal);
            setMovies(res.results || []);
            setTotalPages(res.total_pages > 500 ? 500 : res.total_pages);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Khi keyword thay đổi (người dùng tìm từ khác), reset về trang 1
    useEffect(() => {
        setPage(1);
        fetchMovies(1);
    }, [keyword]);

    // Khi page thay đổi (bấm phân trang), tải trang mới
    useEffect(() => {
        fetchMovies(page);
    }, [page]);

    return (
        <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                Search Results for: <span className="text-red-500">"{keyword}"</span>
            </h2>

            {loading ? (
                <div className="h-96 flex items-center justify-center text-xl">Searching...</div>
            ) : (
                <>
                    {movies.length > 0 ? (
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
                    ) : (
                        <div className="text-center text-gray-400 text-xl mt-20">
                            No movies found for "{keyword}".
                        </div>
                    )}
                </>
            )}
            
            {/* Phân trang */}
            {!loading && movies.length > 0 && (
                 <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            )}
            <div className="pb-10"></div>
        </div>
    );
};

export default SearchPage;