import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import AuthModal from '../common/AuthModal';
import { useAuth } from '../../context/AuthContext';
import BackToTop from '../common/BackToTop';

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

      <BackToTop />

      {/* Popup Đăng nhập/Đăng ký */}
      {isModalOpen && <AuthModal />}
      
    </div>
  );
};

export default MainLayout;