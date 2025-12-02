import React, { useEffect, useState, useRef } from 'react';
import tmdbApi from '../../api/tmdbApi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import TrailerModal from './TrailerModal';
import { useNavigate, Link } from 'react-router-dom';
import BannerSkeleton from '../skeletons/BannerSkeleton';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const HeroBanner = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate();
  
  // Refs cho nút điều hướng custom
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await tmdbApi.getTrendingMovies();
        setMovies(trending.slice(0, 10)); // Lấy 10 phim

        const genreList = await tmdbApi.getGenres('movie');
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getGenreName = (id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : '';
  };

  const handleWatchTrailer = async (movieId) => {
    try {
      const videos = await tmdbApi.getMovieVideos(movieId);
      const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert('Trailer not available');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (movies.length === 0) {
      return <BannerSkeleton />;
  }

  return (
    <div className="relative w-full h-[700px] group">
      
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        spaceBetween={0} // Khoảng cách giữa các slide = 0 để liền mạch
        slidesPerView={1}
        effect="fade" // Hiệu ứng mờ dần (hoặc bỏ dòng này nếu muốn hiệu ứng trượt)
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
            // Gán ref cho nút điều hướng
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full h-full"
      >
        {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
                {/* Ảnh Nền */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})` }}
                >
                    {/* Lớp phủ đen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/40 to-transparent" />
                </div>

                {/* Nội Dung */}
                <div className="relative z-10 max-w-screen-xl mx-auto h-full flex flex-col justify-center px-4 pt-32">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg max-w-3xl leading-tight text-white animate-fade-in-up">
                        {movie.title || movie.name}
                    </h1>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up delay-100">
                        {movie.genre_ids?.slice(0, 3).map((genreId) => (
                            <Link 
                                key={genreId} 
                                to={`/genre/${genreId}`}
                                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/10 hover:bg-red-600 hover:border-red-600 transition text-white"
                            >
                                {getGenreName(genreId)}
                            </Link>
                        ))}
                    </div>

                    <p className="text-base md:text-lg text-gray-200 max-w-2xl mb-8 line-clamp-3 drop-shadow-md animate-fade-in-up delay-200">
                        {movie.overview}
                    </p>

                    <div className="flex gap-4 animate-fade-in-up delay-300">
                        <button
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg hover:shadow-red-600/40"
                        >
                            Watch now
                        </button>
                        <button
                            onClick={() => handleWatchTrailer(movie.id)}
                            className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-bold text-lg transition shadow-lg"
                        >
                            Watch trailer
                        </button>
                    </div>
                </div>
            </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng Custom (Nằm ngoài Swiper để dễ chỉnh vị trí) */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-3 rounded-full z-20 transition backdrop-blur-md opacity-0 group-hover:opacity-100 duration-300 cursor-pointer"
      >
        <LeftOutlined style={{ fontSize: '24px' }} />
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-3 rounded-full z-20 transition backdrop-blur-md opacity-0 group-hover:opacity-100 duration-300 cursor-pointer"
      >
        <RightOutlined style={{ fontSize: '24px' }} />
      </button>

      {/* Popup Trailer */}
      {trailerKey && (
        <TrailerModal
            videoKey={trailerKey}
            onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default HeroBanner;