import React, { useEffect, useState } from 'react';
import MovieSection from './components/MovieSection';
import Header from './components/Header';
import Footer from './components/Footer';
import MovieList from './components/MovieList';
import SeriesList from './components/SeriesList';
import HeroBanner from './components/HeroBanner';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import tmdbApi from './api/tmdbApi';
import MovieDetailPage from './components/MovieDetailPage';
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage';
import GenrePage from './components/GenrePage';
import WatchPage from './components/WatchPage';
import SearchPage from './components/SearchPage';

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Trending Movies: Hàm này API cũ vẫn trả về mảng, giữ nguyên
      setTrendingMovies(await tmdbApi.getTrendingMovies());

      // 2. Top Rated Movies: Hàm này API mới trả về Object -> Cần lấy .results
      const topRatedRes = await tmdbApi.getTopRatedMovies();
      setTopRatedMovies(topRatedRes.results || []); // Thêm || [] để an toàn

      // 3. Trending TV: Hàm này API mới trả về Object -> Cần lấy .results
      const trendingTVRes = await tmdbApi.getTrendingTV();
      setTrendingTV(trendingTVRes.results || []);

      // 4. Top Rated TV: Hàm này API cũ vẫn trả về mảng, giữ nguyên
      setTopRatedTV(await tmdbApi.getTopRatedTV());
    };
    fetchData();
  }, []);

  return (
    <Router>
      <div className="bg-gray min-h-screen px-6">
        <div className="max-w-screen-lg mx-auto pt-24">
          <Header />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage type="movie" />} />
            <Route path="/watch/:type/:id" element={<WatchPage />} />
            <Route path="/tv/:id" element={<MovieDetailPage type="tv" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/genre/:id" element={<GenrePage />} />
            <Route path="/search/:keyword" element={<SearchPage />} />
            <Route
                path="/"
                element={
                  <>
                    <HeroBanner />
                    <MovieSection title="Trending movies" movies={trendingMovies} />
                    <MovieSection title="Top rated movies" movies={topRatedMovies} />
                    <MovieSection title="Trending TV" movies={trendingTV} />
                    <MovieSection title="Top rated TV" movies={topRatedTV} />
                  </>
                }
              />
            <Route
              path="/"
              element={
                <>
                  <MovieSection title="Trending movies" movies={trendingMovies} />
                  <MovieSection title="Top rated movies" movies={topRatedMovies} />
                  <MovieSection title="Trending TV" movies={trendingTV} />
                  <MovieSection title="Top rated TV" movies={topRatedTV} />
                </>
              }
            />
            <Route path="/movie" element={<MovieList movies={trendingMovies.concat(topRatedMovies)} />} />
            <Route path="/tv" element={<SeriesList series={trendingTV.concat(topRatedTV)} />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;