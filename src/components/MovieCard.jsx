import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

const MovieCard = ({ movie, tv, img, id }) => {
  const navigate = useNavigate();
  const title = movie || tv;
  const path = movie ? `/movie/${id}` : `/tv/${id}`;

  return (
    <div
      onClick={() => navigate(path)}
      className="movie-card flex flex-col items-center w-full cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Ảnh phim + overlay + icon */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
        <img
          src={img ? `https://image.tmdb.org/t/p/w500${img}` : 'https://via.placeholder.com/300x450'}
          alt={title}
          className="w-full h-full object-cover transition duration-500 group-hover:brightness-50 group-hover:scale-110"
        />

        {/* Icon play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircleOutlined style={{ fontSize: 40, color: 'white' }} />
        </div>
      </div>

      {/* Tên phim */}
      <p className="text-center text-sm font-semibold truncate w-full mt-3 group-hover:text-red-500 transition-colors">
        {title}
      </p>
    </div>
  );
};

export default MovieCard;