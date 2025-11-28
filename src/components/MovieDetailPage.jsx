import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import TrailerModal from './TrailerModal';
import { PlayCircleOutlined, HeartOutlined, HeartFilled, StarFilled, YoutubeFilled, UserOutlined, WarningOutlined, DeleteOutlined, SendOutlined, CalendarOutlined, GlobalOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import DetailSkeleton from '../skeletons/DetailSkeleton';

const MovieDetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const { user, openModal } = useAuth();

  const [movie, setMovie] = useState(null);
  const [casts, setCasts] = useState([]);
  const [crew, setCrew] = useState([]); // Lưu ekip
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [posters, setPosters] = useState([]);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // 1. Lấy danh sách comment
  useEffect(() => {
      const fetchComments = async () => {
          try {
              const res = await fetch(`http://localhost:3000/api/comments/${type}/${id}`);
              const data = await res.json();
              if (data.data) setComments(data.data);
          } catch (error) {
              console.error("Lỗi tải comment:", error);
          }
      };
      fetchComments();
  }, [id, type]);

  // 2. Kiểm tra trạng thái yêu thích
  useEffect(() => {
    const checkFavoriteStatus = async () => {
        if (!user) return;
        try {
            const res = await fetch('http://localhost:3000/api/user/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            const favoriteKey = `${type}:${id}`; 
            if (result.data && result.data.includes(favoriteKey)) {
                setIsFavorite(true);
            }
        } catch (err) {
            console.error(err);
        }
    };
    checkFavoriteStatus();
  }, [id, type, user]);

  // 3. Lấy thông tin phim
  useEffect(() => {
    // Reset data cũ ngay lập tức
    setMovie(null);
    setCasts([]);
    setCrew([]);
    setVideos([]);
    setSimilar([]);
    setBackdrops([]);
    setPosters([]);
    
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        // Gọi tất cả API cùng lúc, không chờ nhau
        const [
            detail, 
            credits, 
            videoList, 
            similarList, 
            images
        ] = await Promise.all([
            tmdbApi.getDetail(type, id),
            tmdbApi.getCredits(type, id),
            tmdbApi.getVideos(type, id),
            tmdbApi.getSimilar(type, id),
            tmdbApi.getImages(type, id)
        ]);

        // Khi tất cả xong mới set state 1 lần (hoặc set từng cái cũng được)
        setMovie(detail);
        setCasts(credits.cast.slice(0, 10));
        setCrew(credits.crew);
        setVideos(videoList.results || videoList); // API trả về results
        setSimilar(similarList.results || similarList);
        setBackdrops(images.backdrops.slice(0, 10));
        setPosters(images.posters.slice(0, 10));

      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [id, type]);

  if (!movie) return <DetailSkeleton />;

  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                  videos.find(v => v.site === 'YouTube');

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : 'N/A';

  // Lọc thông tin chi tiết
  const directors = type === 'movie' 
      ? crew.filter(member => member.job === 'Director') 
      : movie.created_by || [];
  
  const countries = movie.production_countries?.map(c => c.name).join(', ') || 'N/A';
  const studios = type === 'tv' ? movie.networks : movie.production_companies;

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (ĐÃ KHÔI PHỤC) ---

  const checkAuth = (action) => {
    if (!user) { 
        openModal('login'); 
    } else {
        action();
    }
  };

  const handleToggleFavorite = async () => {
      try {
          const favoriteKey = `${type}:${id}`;
          const res = await fetch('http://localhost:3000/api/user/favorites', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ movieId: favoriteKey })
          });
          const data = await res.json();
          if (res.ok) {
              setIsFavorite(!isFavorite);
          } else {
              alert(data.message || "Lỗi khi cập nhật danh sách");
          }
      } catch (error) {
          console.error("Lỗi yêu thích:", error);
          alert("Lỗi kết nối server");
      }
  };

  const handlePostComment = async () => {
      if (!newComment.trim()) return;
      setCommentLoading(true);
      try {
          const res = await fetch('http://localhost:3000/api/comments', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                  content: newComment,
                  mediaId: id.toString(),
                  mediaType: type
              })
          });
          const result = await res.json();
          if (res.ok) {
              setComments([result.data, ...comments]);
              setNewComment('');
          } else {
              alert(result.message || "Lỗi gửi bình luận");
          }
      } catch (error) {
          console.error(error);
          alert("Lỗi kết nối");
      }
      setCommentLoading(false);
  };

  const handleReport = async (commentId) => {
        if(!window.confirm("Bạn có muốn báo cáo bình luận này vi phạm tiêu chuẩn cộng đồng?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/comments/${commentId}/report`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) alert("Đã gửi báo cáo thành công!");
        } catch (error) {
            console.error(error);
        }
    };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
    try {
        const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setComments(prev => prev.filter(c => c._id !== commentId));
        } else {
            alert("Không thể xóa bình luận này.");
        }
    } catch (error) {
        console.error(error);
    }
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
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight break-words max-w-4xl">
                {title}
            </h1>
            
            <div className="flex items-center flex-wrap gap-4 mb-6 text-sm md:text-base">
              <span className="flex items-center text-yellow-400 font-bold bg-black/40 px-3 py-1 rounded-full border border-yellow-400/30">
                <StarFilled className="mr-2" /> {movie.vote_average?.toFixed(1)} / 10
              </span>
              <span className="flex items-center text-gray-300 font-bold bg-black/40 px-3 py-1 rounded-full border border-gray-500/30">
                <CalendarOutlined className="mr-2 text-white" /> {releaseYear}
              </span>
              {movie.genres?.map(g => (
                <Link 
                    key={g.id} 
                    to={`/genre/${g.id}`} 
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/10 hover:bg-red-600 hover:border-red-600 transition cursor-pointer"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="text-gray-200 text-sm md:text-lg leading-relaxed max-w-3xl mb-8 line-clamp-3 md:line-clamp-4 overflow-hidden">
                {movie.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
                {/* NÚT YÊU THÍCH (ĐÃ CÓ LOGIC) */}
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

                <button 
                    onClick={() => navigate(`/watch/${type}/${id}`)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-base md:text-lg transition shadow-lg hover:shadow-red-600/40 flex items-center gap-2"
                >
                    <PlayCircleOutlined /> Watch Now
                </button>

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
        
        {/* THÔNG TIN CHI TIẾT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
            <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-full"><TeamOutlined className="text-red-500 text-xl"/></div>
                <div>
                    <h3 className="text-gray-400 font-bold text-sm uppercase mb-1">{type === 'tv' ? 'Creators' : 'Director'}</h3>
                    <div className="flex flex-wrap gap-2">
                        {directors.length > 0 ? directors.map(d => (
                            <span key={d.id} className="text-white font-semibold">{d.name}</span>
                        )) : <span className="text-gray-500">Updating...</span>}
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-full"><GlobalOutlined className="text-blue-500 text-xl"/></div>
                <div>
                    <h3 className="text-gray-400 font-bold text-sm uppercase mb-1">Country</h3>
                    <p className="text-white font-semibold">{countries}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-full"><BankOutlined className="text-yellow-500 text-xl"/></div>
                <div>
                    <h3 className="text-gray-400 font-bold text-sm uppercase mb-1">{type === 'tv' ? 'Networks' : 'Production'}</h3>
                    <div className="flex flex-wrap gap-3 items-center">
                        {studios?.slice(0, 3).map(s => (
                            s.logo_path ? (
                                <img key={s.id} src={`https://image.tmdb.org/t/p/w200${s.logo_path}`} alt={s.name} className="h-6 object-contain bg-white/10 rounded px-1" title={s.name} />
                            ) : (
                                <span key={s.id} className="text-white text-sm bg-gray-700 px-2 py-1 rounded">{s.name}</span>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* CASTS */}
        <div>
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {casts.map(cast => (
                <div key={cast.id} className="flex flex-col items-center min-w-[100px] cursor-pointer group" onClick={() => navigate(`/person/${cast.id}`)}>
                    <img src={cast.profile_path ? `https://image.tmdb.org/t/p/w185${cast.profile_path}` : 'https://via.placeholder.com/100x150'} alt={cast.name} className="rounded-lg w-24 h-32 object-cover mb-2 shadow-md group-hover:scale-105 transition duration-300"/>
                    <p className="text-xs text-center font-semibold line-clamp-2 w-full group-hover:text-red-500 transition">{cast.name}</p>
                </div>
            ))}
            </div>
        </div>

        {/* TRAILER & IMAGES */}
        {trailer && (<div><h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Official Trailer</h2><div className="aspect-video w-full max-w-5xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800"><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailer.key}`} title="Trailer" frameBorder="0" allowFullScreen/></div></div>)}
        {backdrops.length > 0 && (<div><h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Backdrops</h2><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">{backdrops.map((img, i) => (<img key={i} src={`https://image.tmdb.org/t/p/w500${img.file_path}`} alt="Backdrop" className="h-40 md:h-52 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"/>))}</div></div>)}
        {posters.length > 0 && (<div><h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Posters</h2><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">{posters.map((img, i) => (<img key={i} src={`https://image.tmdb.org/t/p/w300${img.file_path}`} alt="Poster" className="h-52 md:h-64 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"/>))}</div></div>)}
        
        {/* COMMENTS */}
        <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">Comments <span className="text-gray-400 text-lg font-normal">({comments.length})</span></h2>
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700 mb-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">{user?.avatar ? (<img src={user.avatar} alt="Me" className="w-full h-full object-cover"/>) : (<UserOutlined className="text-white text-xl flex justify-center items-center h-full" />)}</div>
                    <div className="flex-1">
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full bg-[#121212] border border-gray-600 rounded-lg p-3 text-white focus:border-red-500 outline-none transition resize-none h-24" placeholder="Write your review..."></textarea>
                        <div className="text-right mt-3"><button onClick={() => checkAuth(handlePostComment)} disabled={commentLoading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition disabled:opacity-50 uppercase flex items-center gap-2 float-right"><SendOutlined /> {commentLoading ? "Posting..." : "POST"}</button><div className="clear-both"></div></div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {comments.length > 0 ? (comments.map((cmt) => (<div key={cmt._id} className="bg-[#1a1a1a] p-4 rounded-lg flex gap-4 border-b border-gray-800 relative group"><div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 mt-1"><img src={cmt.userId?.avatar || "https://via.placeholder.com/150"} alt="User" className="w-full h-full object-cover"/></div><div className="flex-1"><div className="flex items-center gap-3 mb-1"><span className="font-bold text-white text-sm">{cmt.userId?.fullName || "Unknown"}</span>{user && user._id === cmt.userId?.accountId && (<span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600">You</span>)}</div><span className="text-xs text-gray-500 block mb-2">{new Date(cmt.createdAt).toLocaleString()}</span><p className="text-gray-300 text-sm leading-relaxed">{cmt.content}</p></div><div className="absolute top-4 right-4 flex gap-2">{user && (<>{( (cmt.userId && user._id === cmt.userId.accountId) || user.role === 'ADMIN' ) ? (<button onClick={() => handleDeleteComment(cmt._id)} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/50 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1" title="Xóa bình luận"><DeleteOutlined /> {user.role === 'ADMIN' && user._id !== cmt.userId?.accountId ? 'ADMIN DEL' : 'REMOVE'}</button>) : (<button onClick={() => handleReport(cmt._id)} className="text-gray-500 hover:text-yellow-500 transition p-2 bg-black/20 rounded-full hover:bg-black/50" title="Báo cáo vi phạm"><WarningOutlined style={{ fontSize: '18px' }} /></button>)}</>)}</div></div>))) : (<p className="text-center text-gray-500 italic py-4">No comments yet. Be the first!</p>)}
            </div>
        </div>

        {/* SIMILAR */}
        <div className="mt-10"><h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">You May Also Like</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">{similar.slice(0, 5).map(item => (<div key={item.id} className="cursor-pointer group relative" onClick={() => navigate(`/${type}/${item.id}`)}><div className="relative rounded-lg overflow-hidden mb-2 aspect-[2/3]"><img src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://via.placeholder.com/300x450'} className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-50" alt={item.title || item.name}/><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><PlayCircleOutlined style={{ fontSize: 40, color: 'white' }} /></div></div><p className="text-sm font-semibold truncate text-gray-300 group-hover:text-red-500 transition">{item.title || item.name}</p></div>))}</div>{similar.length === 0 && (<p className="text-gray-500 italic">No similar movies found.</p>)}</div>

      </div>

      {showTrailer && trailer && <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />}
    </div>
  );
};

export default MovieDetailPage;