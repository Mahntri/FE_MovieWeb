import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

const YearPage = () => {
    const { id } = useParams(); // id ở đây chính là NĂM (ví dụ: 2023)
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async (pageVal) => {
        setLoading(true);
        try {
            const res = await tmdbApi.getMoviesByYear(id, pageVal);
            setMovies(res.results || []);
            setTotalPages(res.total_pages > 500 ? 500 : res.total_pages);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setPage(1);
        fetchMovies(1);
    }, [id]);

    useEffect(() => {
        if (page > 1) fetchMovies(page);
    }, [page]);

    return (
        <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                Movies Released in: <span className="text-red-500">{id}</span>
            </h2>
            {loading ? <div className="text-center h-96">Loading...</div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((item) => (
                        <MovieCard key={item.id} movie={item.title} img={item.poster_path} id={item.id} />
                    ))}
                </div>
            )}
            {!loading && movies.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
    );
};

export default YearPage;