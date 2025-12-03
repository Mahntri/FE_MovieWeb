import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    PlayCircleFilled, 
    PlusCircleOutlined, 
    CheckCircleFilled,
    InfoCircleOutlined 
} from '@ant-design/icons'; 
import tmdbApi from '../../api/tmdbApi';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const MovieCard = ({ movie, tv, img, id }) => {
    const navigate = useNavigate();
    const { user, openModal } = useAuth();
    const token = localStorage.getItem('token');

    const title = movie || tv;
    const type = movie ? 'movie' : 'tv';
    const path = `/${type}/${id}`;

    const [isHovered, setIsHovered] = useState(false);
    const [details, setDetails] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    
    const timerRef = useRef(null);
    const posterRef = useRef(null);

    const handleMouseEnter = () => {
        if (posterRef.current) {
            const rect = posterRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY + rect.height / 2,
                left: rect.left + window.scrollX + rect.width / 2,
                width: rect.width * 1.7
            });
        }

        timerRef.current = setTimeout(() => {
            setIsHovered(true);
            fetchDetails();
            checkIfAdded();
        }, 800); 
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setIsHovered(false);
    };

    const fetchDetails = async () => {
        if (details) return;
        try {
            const res = await tmdbApi.getDetail(type, id);
            setDetails(res);
        } catch (error) { console.error(error); }
    };

    const checkIfAdded = async () => {
        if (!user) return;
        try {
            const res = await fetch('${API_BASE_URL}/api/user/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const key = `${type}:${id}`;
            if (data.data && data.data.includes(key)) setIsAdded(true);
        } catch (e) {}
    };

    const handleAddToWatchlist = async (e) => {
        e.stopPropagation();
        if (!user) return openModal('login');
        try {
            const key = `${type}:${id}`;
            const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ movieId: key })
            });
            if (res.ok) setIsAdded(!isAdded);
        } catch (error) { console.error("Lỗi thêm watchlist:", error); }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(path);
    };

    return (
        <>
            {/* --- CONTAINER --- */}
            <div 
                className="w-full cursor-pointer group z-0 flex flex-col"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {/* POSTER */}
                <div 
                    ref={posterRef}
                    className="relative w-full aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden z-10"
                >
                    <img
                        src={img ? `https://image.tmdb.org/t/p/w500${img}` : 'https://placehold.co/300x450'}
                        alt={title}
                        className="w-full h-full object-cover transition duration-300"
                        loading="lazy"
                    />
                    {!isHovered && (
                        <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-all duration-300">
                            <PlayCircleFilled style={{ fontSize: '40px', color: 'white' }} />
                        </div>
                    )}
                </div>

                {/* TÊN PHIM */}
                <p className="mt-2 text-sm font-semibold text-gray-300 truncate group-hover:text-white transition-colors text-center">
                    {title}
                </p>
            </div>

            {/* --- CHI TIẾT --- */}
            {isHovered && createPortal(
                <div 
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => clearTimeout(timerRef.current)}
                    className={`absolute bg-[#1f1f1f] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden 
                                z-[9999] animate-fade-in origin-center`}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        width: coords.width,
                        transform: 'translate(-50%, -50%) scale(1)',
                        minHeight: 'auto',
                    }}
                >
                    <div className="relative w-full aspect-video bg-black">
                        <img
                            src={details?.backdrop_path 
                                ? `https://image.tmdb.org/t/p/w500${details.backdrop_path}` 
                                : `https://image.tmdb.org/t/p/w500${img}`}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <button 
                                className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition shadow-md"
                                title="Xem ngay"
                                onClick={handleClick}
                            >
                                <PlayCircleFilled style={{ fontSize: '20px' }} />
                            </button>

                            <button 
                                onClick={handleAddToWatchlist}
                                className="border-2 border-gray-500 text-gray-300 w-8 h-8 rounded-full flex items-center justify-center hover:border-white hover:text-white transition" 
                                title={isAdded ? "Xóa khỏi danh sách" : "Thêm vào danh sách"}
                            >
                                {isAdded ? (
                                    <CheckCircleFilled style={{ fontSize: '18px', color: '#4ade80' }} />
                                ) : (
                                    <PlusCircleOutlined style={{ fontSize: '18px' }} />
                                )}
                            </button>

                            <button 
                                className="border-2 border-gray-500 text-gray-300 w-8 h-8 rounded-full flex items-center justify-center hover:border-white hover:text-white transition ml-auto"
                                title="Chi tiết"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(path);
                                }}
                            >
                                <InfoCircleOutlined style={{ fontSize: '18px' }} />
                            </button>
                        </div>

                        <h3 className="font-bold text-base mb-2 truncate leading-tight">{title}</h3>
                        
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold mb-2 flex-wrap">
                            <span className="text-green-400 font-bold">{(details?.vote_average || 0).toFixed(1)} Score</span>
                            <span className="border border-gray-500 px-1 rounded text-gray-300">
                                {details?.adult ? '18+' : '13+'}
                            </span>
                            <span>{details?.release_date?.substring(0, 4) || details?.first_air_date?.substring(0, 4)}</span>
                            <span className="bg-gray-800 px-1 rounded">
                                {type === 'movie' 
                                    ? `${details?.runtime || '?'} min` 
                                    : `${details?.number_of_seasons || 1} Season`}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1 items-center">
                            {details?.genres?.slice(0, 3).map((g, i) => (
                                <React.Fragment key={g.id}>
                                    <span className="text-[10px] text-gray-300">{g.name}</span>
                                    {i < Math.min(details.genres.length, 3) - 1 && <span className="text-gray-600 text-[8px]">•</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default MovieCard;