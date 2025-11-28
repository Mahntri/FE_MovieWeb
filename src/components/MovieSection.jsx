import React from 'react';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';

const MovieSection = ({ title, movies }) => (
  <div className="section mb-12 relative">
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

    {/* Container cuộn ngang */}
    <div className="movie-row flex gap-5 overflow-x-auto pb-6 scroll-smooth scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-900">
      {movies.map((item, i) => (
        <div key={item.id} className="w-[180px] flex-shrink-0">
            <MovieCard
              movie={item.title || null}
              tv={item.name || null}
              img={item.poster_path}
              id={item.id}
            />
        </div>
      ))}
    </div>
  </div>
);

export default MovieSection;