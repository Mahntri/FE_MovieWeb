import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import HeroBanner from '../components/common/HeroBanner';
import MovieSection from '../components/common/MovieSection';
import BannerSkeleton from '../components/skeletons/BannerSkeleton'; 
import useDocumentTitle from '../hooks/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle('MoiMovies - Xem phim chất lượng cao');

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trending, topRated, trendTV, topTV] = await Promise.all([
            tmdbApi.getTrendingMovies(),
            tmdbApi.getTopRatedMovies(),
            tmdbApi.getTrendingTV(),
            tmdbApi.getTopRatedTV()
        ]);

        setTrendingMovies(trending.results || trending);
        setTopRatedMovies(topRated.results || topRated);
        setTrendingTV(trendTV.results || trendTV);
        setTopRatedTV(topTV.results || topTV);

      } catch (error) {
        console.error("Error fetching home data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <BannerSkeleton />;

  return (
    <>
      <HeroBanner />
      
      <div className="max-w-screen-xl mx-auto px-4 mt-10 space-y-16">
        {trendingMovies.length > 0 && <MovieSection title="Trending Movies" movies={trendingMovies} />}
        {topRatedMovies.length > 0 && <MovieSection title="Top Rated Movies" movies={topRatedMovies} />}
        {trendingTV.length > 0 && <MovieSection title="Trending TV Series" movies={trendingTV} />}
        {topRatedTV.length > 0 && <MovieSection title="Top Rated TV Series" movies={topRatedTV} />}
      </div>
    </>
  );
};

export default HomePage;