import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard'; 
import Pagination from '../components/common/Pagination';
import ListSkeleton from '../components/skeletons/ListSkeleton'; // 2. Import Skeleton
import useDocumentTitle from '../hooks/useDocumentTitle';

const YearPage = () => {
    const { id } = useParams(); // id ở đây chính là NĂM (ví dụ: 2023)
    const [movies, setMovies] = useState([]);

    useDocumentTitle(`Movies from ${id} - MoiMovies`);
    
    // 3. Thay thế useState page bằng useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

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

    // 4. Gọi data khi id hoặc page thay đổi
    useEffect(() => {
        fetchMovies(page);
    }, [id, page]);

    // 5. Hàm xử lý chuyển trang
    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    // 6. Early return Skeleton
    if (loading) return <ListSkeleton />;

    return (
        <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                Movies Released in: <span className="text-red-500">{id}</span>
            </h2>
            
            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((item) => (
                        <MovieCard 
                            key={item.id} 
                            movie={item.title} 
                            img={item.poster_path} 
                            id={item.id} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 text-xl mt-20">
                    No movies found for this year.
                </div>
            )}

            {!loading && movies.length > 0 && (
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            )}
            <div className="pb-10"></div>
        </div>
    );
};

export default YearPage;