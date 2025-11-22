import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination'; // 👈 Import Pagination

const GenrePage = () => {
    const { id } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // 👈 Thêm state
    const [loading, setLoading] = useState(false);
    const [genreName, setGenreName] = useState('Movies');

    const fetchMovies = async (pageVal) => {
        setLoading(true);
        try {
            const res = await tmdbApi.getMoviesByGenre(id, pageVal);
            setMovies(res.results); // Thay thế list
            setTotalPages(res.total_pages > 500 ? 500 : res.total_pages);
        } catch (error) {
            console.error('Error fetching genre movies:', error);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const getGenreName = async () => {
            try {
                const list = await tmdbApi.getGenres('movie');
                const genre = list.find(g => g.id.toString() === id);
                if (genre) setGenreName(genre.name);
            } catch (err) {
                console.error(err);
            }
        };
        getGenreName();
        
        setPage(1); // Reset về trang 1 khi đổi thể loại
        // Fetch sẽ được gọi bởi useEffect phụ thuộc vào [id, page] bên dưới
    }, [id]);

    useEffect(() => {
        fetchMovies(page);
    }, [id, page]);

    return (
        <div className="text-white pt-24 px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
                Genre: <span className="text-red-500">{genreName}</span>
            </h2>

            {loading ? (
                <div className="h-96 flex items-center justify-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
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
            
            {/* 👇 Pagination 👇 */}
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

export default GenrePage;