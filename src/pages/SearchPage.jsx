import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard'; 
import Pagination from '../components/common/Pagination';
import ListSkeleton from '../components/skeletons/ListSkeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';

const SearchPage = () => {
    const { keyword } = useParams();
    const [movies, setMovies] = useState([]);

    useDocumentTitle(`Search results for "${keyword}" - MoiMovies`);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async (pageVal) => {
        setLoading(true);
        try {
            const res = await tmdbApi.searchMulti(keyword, pageVal);
            const filteredResults = res.results.filter(
                item => item.media_type === 'movie' || item.media_type === 'tv'
            );
            setMovies(filteredResults);
            setTotalPages(res.total_pages > 500 ? 500 : res.total_pages);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMovies(page);
    }, [keyword, page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    if (loading) return <ListSkeleton />;

    return (
        <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                Search Results for: <span className="text-red-500">"{keyword}"</span>
            </h2>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((item) => (
                        <MovieCard
                            key={`${item.id}-${item.media_type}`}
                            movie={item.media_type === 'movie' ? (item.title || item.name) : null}
                            tv={item.media_type === 'tv' ? (item.name || item.title) : null}
                            img={item.poster_path}
                            id={item.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 text-xl mt-20">
                    No results found for "{keyword}".
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

export default SearchPage;