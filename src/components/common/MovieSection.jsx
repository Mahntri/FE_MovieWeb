import React from 'react';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const MovieSection = ({ title, movies }) => (
  <div className="section mb-12 relative">
    {/* Title + View More */}
    <div className="flex justify-between items-center mb-6 px-2">
      <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-3 uppercase tracking-wider">
        {title}
      </h2>
      <Link
        to={title.toLowerCase().includes('movie') ? "/movie" : "/tv"}
        className="text-gray-400 text-sm font-semibold hover:text-red-500 transition flex items-center gap-1"
      >
        View more <span className="text-lg">›</span>
      </Link>
    </div>

    <Swiper
      modules={[FreeMode]}
      freeMode={true}
      grabCursor={true}
      spaceBetween={20}
      slidesPerView="auto"
      className="w-full px-2"
    >
      {movies.map((item, i) => (
        <SwiperSlide key={item.id} className="!w-[180px]">
            <MovieCard
              movie={item.title || null}
              tv={item.name || null}
              img={item.poster_path}
              id={item.id}
            />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default MovieSection;