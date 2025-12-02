import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import { CloseCircleFilled, PlayCircleOutlined } from '@ant-design/icons';
import ListSkeleton from '../components/skeletons/ListSkeleton'; 
import Pagination from '../components/common/Pagination';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { API_BASE_URL } from '../../src/api/config';

const ITEMS_PER_PAGE = 20;

const WatchlistPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useDocumentTitle('Tủ phim của tôi - MoiMovies');
    
    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Lỗi kết nối server");
            const backendData = await res.json();
            
            if (backendData.data && Array.isArray(backendData.data) && backendData.data.length > 0) {
                const allFavoriteIDs = backendData.data.reverse();

                const startIndex = (page - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const currentIds = allFavoriteIDs.slice(startIndex, endIndex);

                const detailPromises = currentIds.map(async (itemString) => {
                    try {
                        const strItem = String(itemString);
                        let mediaType = 'movie'; 
                        let mediaId = strItem;
                        if (strItem.includes(':')) {
                            const parts = strItem.split(':');
                            mediaType = parts[0];
                            mediaId = parts[1];
                        }
                        const detail = await tmdbApi.getDetail(mediaType, mediaId);
                        return { ...detail, originalId: strItem, mediaType: mediaType }; 
                    } catch (err) { return null; }
                });

                const results = await Promise.all(detailPromises);
                setMovies(results.filter(m => m !== null));
                
                setTotalPages(Math.ceil(allFavoriteIDs.length / ITEMS_PER_PAGE));
            } else {
                setMovies([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Lỗi lấy watchlist:", error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchFavorites();
    }, [page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    const removeMovie = async (originalId) => {
        if (!window.confirm("Xóa phim này khỏi Watchlist?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ movieId: originalId }) 
            });

            if (res.ok) {
                fetchFavorites(); 
            }
        } catch (error) { console.error("Lỗi xóa:", error); }
    };

    if (loading) return <ListSkeleton />;

    return (
        <div className="min-h-screen text-white max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-wider">
                My Watchlist
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map(item => (
                    <div key={item.id} className="relative group cursor-pointer">
                        <div 
                            className="relative rounded-lg overflow-hidden aspect-[2/3] shadow-lg border border-gray-800"
                            onClick={() => navigate(`/${item.mediaType}/${item.id}`)}
                        >
                            <img 
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450'} 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-50"
                                alt={item.title || item.name}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircleOutlined style={{ fontSize: 40, color: 'white' }} />
                            </div>
                        </div>

                        <p className="mt-3 text-sm font-bold truncate group-hover:text-red-500 transition text-center">
                            {item.title || item.name}
                        </p>
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removeMovie(item.originalId);
                            }}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-20"
                        >
                            <CloseCircleFilled style={{ fontSize: '18px' }} />
                        </button>
                    </div>
                ))}
            </div>

            {!loading && movies.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl mb-4">Danh sách trống.</p>
                    <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition">
                        Khám phá phim ngay
                    </button>
                </div>
            )}

            {/* Pagination */}
            {!loading && movies.length > 0 && totalPages > 1 && (
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            )}
        </div>
    );
};

export default WatchlistPage;