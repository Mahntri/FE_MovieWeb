import React, { useEffect, useState, useRef } from 'react';
import tmdbApi from '../api/tmdbApi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import TrailerModal from './TrailerModal';
import { useNavigate, Link } from 'react-router-dom';
import BannerSkeleton from '../skeletons/BannerSkeleton';

const HeroBanner = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const [direction, setDirection] = useState(0);
  const bannerRef = useRef(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await tmdbApi.getTrendingMovies();
        const shuffled = trending.sort(() => 0.5 - Math.random());
        setMovies(shuffled.slice(0, 10));

        const genreList = await tmdbApi.getGenres('movie');
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleNext(true);
    }, 6000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (movies.length === 0 || trailerKey) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [movies, currentIndex, trailerKey]);

  const handleNext = (auto = false) => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const movie = movies[currentIndex];
  if (!movie) return null;

  const getGenreName = (id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : '';
  };

  const handleWatchTrailer = async () => {
    try {
      const videos = await tmdbApi.getMovieVideos(movie.id);
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
    <div
      ref={bannerRef}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
      className="relative w-full h-[700px] overflow-hidden text-white group"
    >
      {/* Nút điều hướng */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-3 rounded-full z-20 transition backdrop-blur-md opacity-0 group-hover:opacity-100 duration-300"
      >
        <LeftOutlined style={{ fontSize: '24px' }} />
      </button>
      <button
        onClick={() => handleNext(false)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-3 rounded-full z-20 transition backdrop-blur-md opacity-0 group-hover:opacity-100 duration-300"
      >
        <RightOutlined style={{ fontSize: '24px' }} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/40 to-transparent" />
          
          <div className="relative z-10 max-w-screen-xl mx-auto h-full flex flex-col justify-center px-4 pt-32">
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg max-w-3xl leading-tight">
              {movie.title || movie.name}
            </h1>

            {/* HIỂN THỊ DANH SÁCH THỂ LOẠI */}
            <div className="flex flex-wrap gap-3 mb-6">
                {movie.genre_ids?.slice(0, 3).map((genreId) => (
                    <Link 
                        key={genreId} 
                        to={`/genre/${genreId}`}
                        className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/10 hover:bg-red-600 hover:border-red-600 transition"
                    >
                        {getGenreName(genreId)}
                    </Link>
                ))}
            </div>

            <p className="text-base md:text-lg text-gray-200 max-w-2xl mb-8 line-clamp-3 drop-shadow-md">
              {movie.overview}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg hover:shadow-red-600/40"
              >
                Watch now
              </button>
              <button
                onClick={handleWatchTrailer}
                className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-bold text-lg transition shadow-lg"
              >
                Watch trailer
              </button>
              
              {trailerKey && (
                <TrailerModal
                  videoKey={trailerKey}
                  onClose={() => setTrailerKey(null)}
                />
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroBanner;