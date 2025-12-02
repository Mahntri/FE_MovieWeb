import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Import các trang từ thư mục pages
import HomePage from './pages/HomePage';
import MovieList from './pages/MovieList';
import SeriesList from './pages/SeriesList';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import GenrePage from './pages/GenrePage';
import SearchPage from './pages/SearchPage';
import YearPage from './pages/YearPage';
import CountryPage from './pages/CountryPage';
import PersonPage from './pages/PersonPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            {/* Tất cả các route đều nằm trong MainLayout để có chung Header/Footer */}
            <Route path="/" element={<MainLayout />}>
                
                {/* Trang chủ */}
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />

                {/* Danh sách phim */}
                <Route path="movie" element={<div className="pt-24 max-w-screen-xl mx-auto px-4"><MovieList /></div>} />
                <Route path="tv" element={<div className="pt-24 max-w-screen-xl mx-auto px-4"><SeriesList /></div>} />

                {/* Chi tiết & Xem phim */}
                <Route path=":type/:id" element={<MovieDetailPage />} />
                <Route path="watch/:type/:id" element={<WatchPage />} />

                {/* Bộ lọc & Tìm kiếm */}
                <Route path="genre/:id" element={<div className="pt-0"><GenrePage /></div>} />
                <Route path="search/:keyword" element={<div className="pt-0"><SearchPage /></div>} />
                <Route path="year/:id" element={<div className="pt-0"><YearPage /></div>} />
                <Route path="country/:id" element={<div className="pt-0"><CountryPage /></div>} />
                <Route path="person/:id" element={<div className="pt-0"><PersonPage /></div>} />

                {/* Trang cá nhân (Cần đăng nhập) */}
                <Route path="watchlist" element={<div className="pt-24"><WatchlistPage /></div>} />
                <Route path="profile" element={<div className="pt-24"><ProfilePage /></div>} />
                
                {/* Trang Admin */}
                <Route path="admin" element={<AdminPage />} />

                <Route path="*" element={
                    <div className="text-center pt-40">
                        <h1 className="text-4xl font-bold text-red-600">404</h1>
                        <p className="text-xl">Page not found</p>
                        <button onClick={() => window.location.href = '/'} className="mt-4 bg-red-600 px-4 py-2 rounded">Go Home</button>
                    </div>
                } />

            </Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;