import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Outlet là nơi nội dung các trang con (Home, Movie...) hiển thị
import Header from '../common/Header';     // Import từ thư mục common
import Footer from '../common/Footer';
import AuthModal from '../common/AuthModal';
import { useAuth } from '../../context/AuthContext'; // Import context (lùi 2 cấp thư mục)

const MainLayout = () => {
  const { isModalOpen } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      
      <Header />
      
      <div className="min-h-screen pb-10">
        <Outlet />
      </div>

      {!isAdminPage && <Footer />}

      {/* Popup Đăng nhập/Đăng ký hiển thị toàn cục */}
      {isModalOpen && <AuthModal />}
      
    </div>
  );
};

export default MainLayout;