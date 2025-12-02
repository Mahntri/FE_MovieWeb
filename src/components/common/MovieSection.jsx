import React from 'react';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';

// 1. Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

// 2. Import CSS Swiper
import 'swiper/css';
import 'swiper/css/free-mode';

const MovieSection = ({ title, movies }) => (
  <div className="section mb-12 relative">
    {/* Header: Title + View More */}
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

    {/* 3. Thay thẻ div cũ bằng Swiper */}
    <Swiper
      modules={[FreeMode]}         // Kích hoạt module FreeMode
      freeMode={true}              // Cho phép kéo tự do
      grabCursor={true}            // Con trỏ chuột biến thành hình bàn tay
      spaceBetween={20}            // Khoảng cách giữa các thẻ (20px)
      slidesPerView="auto"         // Tự động tính toán số lượng thẻ dựa trên chiều rộng thẻ
      className="w-full px-2"      // Padding x để không bị sát lề quá
    >
      {movies.map((item, i) => (
        // 4. Mỗi phim là một SwiperSlide
        // !w-[180px]: Bắt buộc chiều rộng thẻ là 180px (giống code cũ)
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