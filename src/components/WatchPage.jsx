import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const WatchPage = () => {
  const { type, id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const embedUrl = type === 'movie' 
    ? `https://www.2embed.cc/embed/${id}`
    : `https://www.2embed.cc/embedtv/${id}&s=1&e=1`;

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-24 px-4 md:px-8 pb-10">
      <div className="max-w-screen-xl mx-auto">
        
        {/* 1. MÀN HÌNH VIDEO */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-gray-800 mb-8">
          <iframe
            src={embedUrl}
            title="Movie Player"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>

        {/* Thông báo */}
        <p className="text-center text-gray-500 text-sm mb-10 italic">
            Nếu phim không chạy, hãy thử đổi Server hoặc tắt chặn quảng cáo (Đây là nguồn phim demo).
        </p>

        {/* 2. MỤC COMMENT */}
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-3">
                Comments <span className="text-gray-400 text-lg font-normal">(0)</span>
            </h2>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">
                        U
                    </div>
                    <textarea 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition h-24 resize-none"
                        placeholder="Share your thoughts about this movie..."
                    ></textarea>
                </div>
                <div className="text-right">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition">
                        Post Comment
                    </button>
                </div>

                {/* Danh sách comment trống */}
                <div className="mt-8 text-center pt-8 border-t border-gray-700">
                    <p className="text-gray-400">No comments yet. Be the first to discuss this movie!</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default WatchPage;