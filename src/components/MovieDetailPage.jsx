import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import TrailerModal from './TrailerModal';
import AuthModal from './AuthModal';
import { PlayCircleOutlined, HeartOutlined, HeartFilled, StarFilled, YoutubeFilled } from '@ant-design/icons';

const MovieDetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [casts, setCasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [posters, setPosters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const detail = await tmdbApi.getDetail(type, id);
        const credits = await tmdbApi.getCredits(type, id);
        const videoList = await tmdbApi.getVideos(type, id);
        const similarList = await tmdbApi.getSimilar(type, id);
        const images = await tmdbApi.getImages(type, id);

        setMovie(detail);
        setCasts(credits.cast.slice(0, 10));
        setVideos(videoList);
        setSimilar(similarList.slice(0, 10));
        setBackdrops(images.backdrops.slice(0, 10));
        setPosters(images.posters.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch detail:', err);
      }
    };

    fetchData();
  }, [id, type]);

  if (!movie) return <div className="text-white p-10 text-center">Loading...</div>;

  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                  videos.find(v => v.site === 'YouTube');

  const title = movie.title || movie.name;


  const checkAuth = (action) => {
    const token = localStorage.getItem('token');
    if (!token) {
        setShowAuthModal(true); // Chưa đăng nhập -> Hiện Popup
    } else {
        action(); // Đã đăng nhập -> Thực hiện hành động
    }
  };

  // Logic xử lý Yêu thích
  const handleToggleFavorite = () => {
      setIsFavorite(!isFavorite);
      // Sau này gọi API backend lưu favorite ở đây
  };

  // Logic xử lý Comment
  const handlePostComment = () => {
      alert("Comment posted! (Backend logic here)");
  };

  return (
    <div className="text-white bg-gray-900 min-h-screen pb-20">
      
      {/* 1. HERO BANNER */}
      <div
        className="relative w-full h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/50 to-transparent" />
        
        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col md:flex-row items-end h-full px-6 pb-12 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="hidden md:block w-72 rounded-xl shadow-2xl border-2 border-white/20 flex-shrink-0" 
            alt={title}
          />
          
          <div className="flex-1 mb-4 w-full">
            {/* 👇 XỬ LÝ TIÊU ĐỀ DÀI: max-w, leading-tight, break-words */}
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight break-words max-w-4xl">
                {title}
            </h1>
            
            <div className="flex items-center flex-wrap gap-4 mb-6 text-sm md:text-base">
              <span className="flex items-center text-yellow-400 font-bold bg-black/40 px-3 py-1 rounded-full border border-yellow-400/30">
                <StarFilled className="mr-2" /> {movie.vote_average?.toFixed(1)} / 10
              </span>
              {/* Giới hạn hiển thị Genre nếu quá nhiều */}
              {movie.genres?.slice(0, 3).map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/10">
                  {g.name}
                </span>
              ))}
            </div>

            {/* 👇 XỬ LÝ NỘI DUNG DÀI: line-clamp-3 (mobile), md:line-clamp-4 (pc) */}
            <p className="text-gray-200 text-sm md:text-lg leading-relaxed max-w-3xl mb-8 line-clamp-3 md:line-clamp-4 overflow-hidden">
                {movie.overview}
            </p>
            
            {/* Nút Chức Năng */}
            <div className="flex flex-wrap gap-4">
                
                {/* 1. Nút Yêu Thích */}
                <button 
                        onClick={() => checkAuth(handleToggleFavorite)} 
                        className={`px-6 py-3 rounded-full font-bold text-base md:text-lg transition shadow-lg border-2 flex items-center gap-2
                            ${isFavorite 
                                ? 'bg-white text-red-600 border-white' 
                                : 'bg-black/40 text-white border-white hover:bg-white hover:text-black'
                            }`}
                    >
                        {isFavorite ? <HeartFilled /> : <HeartOutlined />} 
                        {isFavorite ? 'Added' : 'Add to Favorites'}
                  </button>

                {/* 2. Nút Xem Phim */}
                <button 
                    onClick={() => navigate(`/watch/${type}/${id}`)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-base md:text-lg transition shadow-lg hover:shadow-red-600/40 flex items-center gap-2"
                >
                    <PlayCircleOutlined /> Watch Movie
                </button>

                {/* 3. Nút Xem Trailer Popup */}
                <button
                    onClick={() => {
                        if (trailer) setShowTrailer(true);
                        else alert("Trailer not available");
                    }}
                    className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold text-base md:text-lg transition shadow-lg flex items-center gap-2"
                >
                    <YoutubeFilled className="text-red-600 text-xl" /> Trailer
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 mt-10 space-y-16">
        
        {/* 2. CASTS */}
        <div>
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {casts.map(cast => (
                <div key={cast.id} className="flex flex-col items-center min-w-[100px]">
                <img
                    src={cast.profile_path ? `https://image.tmdb.org/t/p/w185${cast.profile_path}` : 'https://via.placeholder.com/100x150'}
                    alt={cast.name}
                    className="rounded-lg w-24 h-32 object-cover mb-2 shadow-md"
                />
                <p className="text-xs text-center font-semibold line-clamp-2 w-full">{cast.name}</p>
                </div>
            ))}
            </div>
        </div>

        {/* 3. OFFICIAL TRAILER */}
        {trailer && (
            <div>
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Official Trailer</h2>
                <div className="aspect-video w-full max-w-5xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    frameBorder="0"
                    allowFullScreen
                    />
                </div>
            </div>
        )}

        {/* 4. BACKDROPS */}
        {backdrops.length > 0 && (
            <div>
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Backdrops</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {backdrops.map((img, i) => (
                        <img 
                            key={i}
                            src={`https://image.tmdb.org/t/p/w500${img.file_path}`} 
                            alt="Backdrop" 
                            className="h-40 md:h-52 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>
            </div>
        )}

        {/* 5. POSTERS */}
        {posters.length > 0 && (
            <div>
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Posters</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {posters.map((img, i) => (
                        <img 
                            key={i}
                            src={`https://image.tmdb.org/t/p/w300${img.file_path}`} 
                            alt="Poster" 
                            className="h-52 md:h-64 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>
            </div>
        )}

        {/* 6. COMMENTS */}
        <div>
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">
                    Comments <span className="text-gray-400 text-lg font-normal">(0)</span>
                </h2>
                <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
                    <p className="text-gray-400 mb-4">No comments yet. Be the first to discuss this movie!</p>
                    <button 
                        onClick={() => checkAuth(handlePostComment)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm transition"
                    >
                        Write a comment
                    </button>
                </div>
          </div>

        {/* 7. SIMILAR MOVIES */}
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {similar.slice(0, 5).map(item => (
                    <div
                        key={item.id}
                        className="cursor-pointer group relative"
                        onClick={() => navigate(`/${type}/${item.id}`)}
                    >
                        <div className="relative rounded-lg overflow-hidden mb-2 aspect-[2/3]">
                            <img
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://via.placeholder.com/300x450'}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-50"
                                alt={item.title || item.name}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircleOutlined style={{ fontSize: 40, color: 'white' }} />
                            </div>
                        </div>
                        <p className="text-sm font-semibold truncate text-gray-300 group-hover:text-red-500 transition">
                            {item.title || item.name}
                        </p>
                    </div>
                ))}
            </div>
            {similar.length === 0 && (
                <p className="text-gray-500 italic">No similar movies found.</p>
            )}
        </div>

      </div>

      {showTrailer && trailer && (
          <TrailerModal 
            videoKey={trailer.key} 
            onClose={() => setShowTrailer(false)} 
          />
      )}

      {showAuthModal && (
        <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLoginSuccess={() => {
                // Người dùng đã đăng nhập xong, có thể tự động thực hiện hành động tiếp theo nếu muốn
                // Ở đây mình chỉ log ra thôi
                console.log("User logged in via popup!");
            }} 
        />
      )}

    </div>
  );
};

export default MovieDetailPage;