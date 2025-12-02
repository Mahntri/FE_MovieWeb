import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import { useAuth } from '../context/AuthContext';
import { 
    UserOutlined, 
    SendOutlined, 
    WarningOutlined, 
    StepForwardOutlined, 
    HeartOutlined, 
    HeartFilled, 
    MessageOutlined,
    ExclamationCircleOutlined 
} from '@ant-design/icons';
import { API_BASE_URL } from '../../src/api/config';

const WatchPage = () => {
  const { type, id } = useParams();
  const { user, openModal } = useAuth();
  const token = localStorage.getItem('token');

  const commentSectionRef = useRef(null);

  const [movieInfo, setMovieInfo] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(''); 
  const [episodes, setEpisodes] = useState([]); 
  const [currentEpSlug, setCurrentEpSlug] = useState(''); 
  const [serverName, setServerName] = useState(''); 
  const [isBackup, setIsBackup] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(10);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Lấy thông tin phim và trạng thái yêu thích
    const fetchMovieInfo = async () => {
        try {
            const info = await tmdbApi.getDetail(type, id);
            setMovieInfo(info);

            // Check Favorite
            if (user) {
                const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await res.json();
                const key = `${type}:${id}`;
                if (result.data && result.data.includes(key)) setIsFavorite(true);
            }
        } catch (e) { console.error(e); }
    };

    // Lấy nguồn phim
    const fetchMovieSource = async () => {
        const backupEmbed = type === 'movie' 
            ? `https://www.2embed.cc/embed/${id}`
            : `https://www.2embed.cc/embedtv/${id}&s=1&e=1`;

        try {
            const data = await tmdbApi.getFilmFromKKPhim(type, id);

            if (data && data.episodes && data.episodes.length > 0) {
                const serverData = data.episodes[0].server_data;
                setEpisodes(serverData);
                setServerName(data.episodes[0].server_name);
                setIsBackup(false);

                if (serverData.length > 0) {
                    setEmbedUrl(serverData[0].link_embed);
                    setCurrentEpSlug(serverData[0].slug);
                }
            } else {
                throw new Error("No data");
            }
        } catch (error) {
            console.log("Chuyển sang nguồn dự phòng...");
            setEmbedUrl(backupEmbed);
            setEpisodes([]);
            setIsBackup(true);
        }
    };

    // Lấy Comment
    const fetchComments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/comments/${type}/${id}`);
            const data = await res.json();
            if (data.data) setComments(data.data);
        } catch (e) { console.error(e); }
    };

    fetchMovieInfo();
    fetchMovieSource();
    fetchComments();

  }, [type, id, user]);

  // --- CÁC HÀM XỬ LÝ ---

  const handleChangeEpisode = (ep) => {
      setEmbedUrl(ep.link_embed);
      setCurrentEpSlug(ep.slug);
  };

  const handleNextEpisode = () => {
      const currentIndex = episodes.findIndex(ep => ep.slug === currentEpSlug);
      if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
          handleChangeEpisode(episodes[currentIndex + 1]);
      } else {
          alert("Đây là tập cuối rồi!");
      }
  };

  const checkAuth = (action) => { if (!user) openModal('login'); else action(); };

  const handleToggleFavorite = async () => {
      try {
          const key = `${type}:${id}`;
          const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ movieId: key })
          });
          if (res.ok) setIsFavorite(!isFavorite);
      } catch (e) { alert("Lỗi kết nối"); }
  };

  const handleScrollToComment = () => {
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReportVideo = async () => {
      if (!user) return openModal('login');

      const description = prompt("Mô tả lỗi bạn gặp phải (Ví dụ: Mất tiếng, sai phụ đề...):");
      if (!description) return;

      try {
          const res = await fetch(`${API_BASE_URL}/api/reports`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                  mediaId: id, 
                  mediaType: type, 
                  title: movieInfo?.title || movieInfo?.name || "Unknown", 
                  description 
              })
          });

          if (res.ok) alert("Cảm ơn bạn đã báo lỗi! Admin sẽ kiểm tra sớm.");
          else alert("Gửi báo cáo thất bại.");
      } catch (e) {
          console.error(e);
      }
  };

  const handlePostComment = async () => {
      if (!newComment.trim()) return;
      setCommentLoading(true);
      try {
          const res = await fetch(`${API_BASE_URL}/api/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ content: newComment, mediaId: id.toString(), mediaType: type })
          });
          const result = await res.json();
          if (res.ok) {
              setComments([result.data, ...comments]);
              setNewComment('');
          }
      } catch (e) { console.error(e); }
      setCommentLoading(false);
  };

  // Logic phân trang comment
  const currentComments = comments.slice(0, visibleComments);
  const handleLoadMoreComments = () => {
      setVisibleComments(prev => prev + 10);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-24 px-4 md:px-8 pb-10">
      <div className="max-w-screen-xl mx-auto">
        
        {/* TIÊU ĐỀ PHIM */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            {movieInfo ? (movieInfo.title || movieInfo.name) : "Loading..."}
        </h1>

        {/* MÀN HÌNH VIDEO */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-gray-800 mb-4">
          {embedUrl ? (
              <iframe src={embedUrl} title="Movie Player" className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; encrypted-media"></iframe>
          ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Video...</div>
          )}
        </div>

        {/* THANH CÔNG CỤ */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#1f1f1f] p-4 rounded-xl border border-gray-700">
            <button 
                onClick={handleNextEpisode}
                disabled={episodes.length <= 1}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition"
            >
                <StepForwardOutlined /> Tập tiếp
            </button>
            
            <button 
                onClick={() => checkAuth(handleToggleFavorite)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition border border-gray-600
                    ${isFavorite ? 'bg-red-600 text-white border-red-600' : 'bg-transparent hover:bg-gray-700'}`}
            >
                {isFavorite ? <HeartFilled /> : <HeartOutlined />} Yêu thích
            </button>

            <button 
                onClick={handleScrollToComment}
                className="flex items-center gap-2 bg-transparent hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg font-bold transition"
            >
                <MessageOutlined /> Bình luận
            </button>

            <button 
                onClick={handleReportVideo}
                className="flex items-center gap-2 bg-transparent hover:bg-yellow-900/30 text-yellow-500 border border-yellow-600/50 px-4 py-2 rounded-lg font-bold transition ml-auto"
            >
                <ExclamationCircleOutlined /> Báo lỗi
            </button>
        </div>

        {/* Thông báo nguồn dự phòng */}
        {isBackup && (
            <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-200 flex items-center gap-3 text-sm">
                <WarningOutlined />
                <span>Đang phát từ nguồn dự phòng (Không có danh sách tập).</span>
            </div>
        )}

        {/* DANH SÁCH TẬP PHIM */}
        {episodes.length > 0 && (
            <div className="mb-10 bg-[#1f1f1f] p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-300 border-b border-gray-700 pb-2">
                    Danh sách tập ({serverName || 'Vietsub'})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {episodes.map((ep) => (
                        <button
                            key={ep.slug}
                            onClick={() => handleChangeEpisode(ep)}
                            className={`px-4 py-2 rounded font-bold text-sm transition min-w-[3.5rem]
                                ${currentEpSlug === ep.slug 
                                    ? 'bg-red-600 text-white shadow-lg scale-105' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {episodes.length === 1 ? "Full" : ep.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* MỤC COMMENT */}
        <div className="max-w-4xl mx-auto" ref={commentSectionRef}>
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">
                Comments <span className="text-gray-400 text-lg font-normal">({comments.length})</span>
            </h2>
            
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700 mb-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserOutlined className="text-white text-xl flex justify-center items-center h-full" />}
                    </div>
                    <div className="flex-1">
                        <textarea 
                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                            className="w-full bg-[#121212] border border-gray-600 rounded-lg p-3 text-white focus:border-red-500 outline-none h-24 resize-none"
                            placeholder="Share your thoughts..."
                        ></textarea>
                        <div className="text-right mt-2">
                            <button onClick={() => checkAuth(handlePostComment)} disabled={commentLoading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 float-right disabled:opacity-50">
                                <SendOutlined /> Post
                            </button>
                            <div className="clear-both"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách Comment */}
            <div className="space-y-4">
                {currentComments.length > 0 ? currentComments.map(cmt => (
                    <div key={cmt._id} className="bg-[#1a1a1a] p-4 rounded-lg flex gap-4 border-b border-gray-800">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 mt-1">
                            <img src={cmt.userId?.avatar || "https://via.placeholder.com/150"} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white text-sm">{cmt.userId?.fullName || "Unknown"}</span>
                                <span className="text-xs text-gray-500">• {new Date(cmt.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{cmt.content}</p>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500">No comments yet.</p>}
            </div>

            {/* Nút Tải thêm */}
            {visibleComments < comments.length && (
                <div className="mt-6">
                    <button 
                        onClick={handleLoadMoreComments}
                        className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 rounded shadow-lg transition duration-300 ease-in-out uppercase tracking-wide"
                    >
                        Tải thêm 10 bình luận
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default WatchPage;