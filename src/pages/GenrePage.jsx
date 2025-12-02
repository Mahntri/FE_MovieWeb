import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard';
import Pagination from '../components/common/Pagination';
import ListSkeleton from '../components/skeletons/ListSkeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';

const GenrePage = () => {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    
    // 2. Thay thế useState page bằng useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [genreName, setGenreName] = useState('Genre');

    useDocumentTitle(`${genreName} genre movies - MoiMovies`);

    const fetchData = async (pageVal) => {
        setLoading(true);
        try {
            const [movieRes, tvRes] = await Promise.all([
                tmdbApi.getMoviesByGenre(id, pageVal),
                tmdbApi.getTVsByGenre(id, pageVal)
            ]);

            const movies = movieRes.results.map(m => ({ ...m, media_type: 'movie' }));
            const tvs = tvRes.results.map(t => ({ ...t, media_type: 'tv' }));
            const combined = [...movies, ...tvs].sort((a, b) => b.popularity - a.popularity);

            setItems(combined);
            const maxPage = Math.max(movieRes.total_pages, tvRes.total_pages);
            setTotalPages(maxPage > 500 ? 500 : maxPage);

        } catch (error) {
            console.error('Error fetching genre data:', error);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Khi đổi thể loại (id thay đổi) -> Reset về trang 1
    useEffect(() => {
        const getGenreName = async () => {
            try {
                const list = await tmdbApi.getGenres('movie');
                const genre = list.find(g => g.id.toString() === id);
                if (genre) setGenreName(genre.name);
            } catch (err) { console.error(err); }
        };
        getGenreName();
        
        
    }, [id]);

    // Gọi data khi page hoặc id thay đổi
    useEffect(() => {
        fetchData(page);
    }, [id, page]);

    // 3. Hàm xử lý chuyển trang
    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    // Skeleton Loading
    if (loading) return <ListSkeleton />;

    return (
        <div className="text-white pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                Genre: <span className="text-red-500">{genreName}</span>
            </h2>

            {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((item) => (
                        <MovieCard
                            key={item.id + item.media_type}
                            movie={item.media_type === 'movie' ? (item.title || item.name) : null}
                            tv={item.media_type === 'tv' ? (item.name || item.title) : null}
                            img={item.poster_path}
                            id={item.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 text-xl mt-20">
                    No movies or TV shows found for this genre.
                </div>
            )}
            
            {!loading && items.length > 0 && (
                 <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} // 4. Sử dụng hàm handlePageChange
                />
            )}
            <div className="pb-10"></div>
        </div>
    );
};

export default GenrePage;