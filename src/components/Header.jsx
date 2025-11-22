import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCaretDown, FaSearch } from 'react-icons/fa'; // Nhớ cài react-icons nếu chưa
import tmdbApi from '../api/tmdbApi';

const headerNav = [
    { display: 'Home', path: '/' },
    { display: 'Movies', path: '/movie' },
    { display: 'TV Series', path: '/tv' }
];

const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const searchRef = useRef(null); // Ref để xử lý click ra ngoài thì đóng search

    const [genres, setGenres] = useState([]);
    
    // State cho tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);

    const active = headerNav.findIndex(e => e.path === pathname);

    // Xử lý thu nhỏ header + Lấy Genre
    useEffect(() => {
        const shrinkHeader = () => {
            if (headerRef.current) { 
                if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                    headerRef.current.classList.add('shrink');
                } else {
                    headerRef.current.classList.remove('shrink');
                }
            }
        };
        window.addEventListener('scroll', shrinkHeader);

        const fetchGenres = async () => {
            try {
                const res = await tmdbApi.getGenres('movie');
                setGenres(res);
            } catch (error) {
                console.log('Error fetching genres', error);
            }
        };
        fetchGenres();

        // Xử lý click ra ngoài để đóng search dropdown
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', shrinkHeader);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Xử lý tìm kiếm khi gõ (Debounce đơn giản)
    useEffect(() => {
        const getSuggestions = async () => {
            if (keyword.trim().length > 1) {
                try {
                    // Tìm cả movie (có thể đổi thành searchTV nếu thích)
                    const response = await tmdbApi.searchMovie(keyword);
                    setSearchResults(response.results.slice(0, 5)); // Lấy 5 kết quả đầu
                    setShowSearch(true);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setSearchResults([]);
                setShowSearch(false);
            }
        };

        const timeout = setTimeout(() => {
            getSuggestions();
        }, 300); // Đợi 300ms sau khi ngừng gõ mới gọi API

        return () => clearTimeout(timeout);
    }, [keyword]);

    // Xử lý chuyển trang khi nhấn Enter hoặc click nút đỏ
    const handleGoToSearchPage = () => {
        if (keyword.trim()) {
            setShowSearch(false);
            // Hiện tại chuyển tạm về trang movie list, 
            // sau này bạn có thể làm trang /search riêng
            navigate(`/search/${keyword}`); 
            setKeyword(''); 
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleGoToSearchPage();
        }
    };

    return (
        <>
            {/* Desktop Header */}
            <div ref={headerRef} className="header bg-black p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out hidden md:block">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 h-12">
                    
                    {/* 1. LOGO (Đã sửa: Bọc toàn bộ trong Link) */}
                    <Link to="/" className="logo flex items-center gap-3 group">
                        <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover group-hover:brightness-110 transition" />
                        <span className="font-bold text-white text-3xl group-hover:text-red-500 transition">MoiMovies</span>
                    </Link>

                    {/* 2. NAV AREA */}
                    <div className="flex items-center gap-8">
                        <ul className="header__nav flex items-center space-x-6">
                            {/* A. 3 Mục Chính */}
                            {headerNav.map((e, i) => (
                                <li key={i} className="relative text-white font-bold text-lg group">
                                    <Link 
                                        to={e.path}
                                        className={`inline-block text-white group-hover:text-red-500 transition ${i === active ? 'text-red-500' : ''}`}
                                    >
                                        {e.display}
                                    </Link>
                                </li>
                            ))}

                            {/* B. MỤC THỂ LOẠI (GENRES) */}
                            <li className="relative group text-white font-bold text-lg cursor-pointer">
                                <span className="flex items-center gap-1 group-hover:text-red-500 transition">
                                    Genres <FaCaretDown className="text-sm" />
                                </span>
                                <div className="absolute top-full right-[-50px] pt-4 hidden group-hover:block w-[400px]">
                                    <div className="bg-gray-900 bg-opacity-95 p-5 rounded-lg shadow-xl grid grid-cols-3 gap-3 border border-gray-700">
                                        {genres.map((item) => (
                                            <Link key={item.id} to={`/genre/${item.id}`} className="text-sm text-gray-300 hover:text-red-500 block">
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>

                        {/* C. THANH TÌM KIẾM (MỚI THÊM) */}
                        <div className="relative" ref={searchRef}>
                            <div className="flex items-center bg-gray-800 rounded-full px-4 py-1.5 border border-gray-700 focus-within:border-red-500 transition-colors w-64">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search movies..." 
                                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => keyword.length > 1 && setShowSearch(true)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Dropdown Kết quả tìm kiếm (Giống ảnh) */}
                            {showSearch && searchResults.length > 0 && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50">
                                    {/* Danh sách phim */}
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        {searchResults.map((movie) => (
                                            <div 
                                                key={movie.id}
                                                onClick={() => {
                                                    navigate(`/movie/${movie.id}`);
                                                    setShowSearch(false);
                                                    setKeyword('');
                                                }}
                                                className="flex items-start p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 transition"
                                            >
                                                <img 
                                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/50x75'} 
                                                    alt={movie.title} 
                                                    className="w-12 h-16 object-cover rounded mr-3"
                                                />
                                                <div>
                                                    <h4 className="text-white text-sm font-bold line-clamp-1">{movie.title || movie.name}</h4>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'} • Vote: {movie.vote_average?.toFixed(1)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Nút Enter màu đỏ ở dưới cùng */}
                                    <div 
                                        onClick={handleGoToSearchPage}
                                        className="bg-red-700 text-white text-center py-3 font-bold text-sm cursor-pointer hover:bg-red-600 transition"
                                    >
                                        Enter để tìm kiếm
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* D. NÚT LOGIN */}
                        <Link 
                            to="/login"
                            className="flex items-center gap-2 text-white bg-red-600 px-5 py-1.5 rounded-full font-semibold hover:bg-red-700 transition shadow-lg text-sm"
                        >
                            <FaUserCircle className="text-lg" />
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-black text-white py-4 border-b border-gray-700 fixed top-0 left-0 right-0 z-50 px-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide">tMovies</Link>
                {/* Nút tìm kiếm mobile đơn giản (nếu cần) */}
                <FaSearch className="text-xl" />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 flex justify-around py-2 text-white md:hidden z-50">
                {headerNav.map((e, i) => (
                    <Link key={i} to={e.path} className={`flex flex-col items-center text-xs ${pathname === e.path ? 'text-red-500' : ''}`}>
                        <span className="font-bold">{e.display}</span>
                    </Link>
                ))}
                <Link to="/login" className="flex flex-col items-center text-xs">
                    <FaUserCircle className="text-xl" />
                    <span>Login</span>
                </Link>
            </div>
        </>
    );
}

export default Header;