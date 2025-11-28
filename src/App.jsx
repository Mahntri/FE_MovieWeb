import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import MovieSection from './components/MovieSection';
import MovieList from './components/MovieList';
import SeriesList from './components/SeriesList';
import MovieDetailPage from './components/MovieDetailPage';
import GenrePage from './components/GenrePage';
import WatchPage from './components/WatchPage';
import SearchPage from './components/SearchPage';
import WatchlistPage from './components/WatchlistPage';
import ProfilePage from './components/ProfilePage';
import PersonPage from './components/PersonPage';
import tmdbApi from './api/tmdbApi';
import AdminPage from './components/AdminPage';
import YearPage from './components/YearPage';
import CountryPage from './components/CountryPage';


const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTrendingMovies(await tmdbApi.getTrendingMovies());
        const topRatedRes = await tmdbApi.getTopRatedMovies();
        setTopRatedMovies(topRatedRes.results || []);
        const trendingTVRes = await tmdbApi.getTrendingTV();
        setTrendingTV(trendingTVRes.results || []);
        setTopRatedTV(await tmdbApi.getTopRatedTV());
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeroBanner />
      
      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <MovieSection title="Trending movies" movies={trendingMovies} />
        <MovieSection title="Top rated movies" movies={topRatedMovies} />
        <MovieSection title="Trending TV" movies={trendingTV} />
        <MovieSection title="Top rated TV" movies={topRatedTV} />
      </div>
    </>
  );
};

const MainLayout = () => {
  const { isModalOpen } = useAuth(); 
  
  return (
    <>
      <Header />
      
      <div className="min-h-screen pb-10"> 
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/movie" element={<div className="pt-24 max-w-screen-xl mx-auto px-4"><MovieList /></div>} />
            <Route path="/tv" element={<div className="pt-24 max-w-screen-xl mx-auto px-4"><SeriesList /></div>} />
            <Route path="/genre/:id" element={<div className="pt-0"><GenrePage /></div>} />
            <Route path="/search/:keyword" element={<div className="pt-0"><SearchPage /></div>} />
            <Route path="/person/:id" element={<div className="pt-0"><PersonPage /></div>} />
            
            <Route path="/movie/:id" element={<MovieDetailPage type="movie" />} />
            <Route path="/tv/:id" element={<MovieDetailPage type="tv" />} />
            <Route path="/watch/:type/:id" element={<WatchPage />} />
            <Route path="/year/:id" element={<div className="pt-0"><YearPage /></div>} />
            <Route path="/country/:id" element={<div className="pt-0"><CountryPage /></div>} />
            
            <Route path="/watchlist" element={<div className="pt-24"><WatchlistPage /></div>} />
            <Route path="/profile" element={<div className="pt-24"><ProfilePage /></div>} />

            <Route path="/admin" element={<AdminPage />} />
          </Routes>
      </div>

      <Footer />
      {isModalOpen && <AuthModal />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 min-h-screen text-white"> 
          <MainLayout /> 
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;