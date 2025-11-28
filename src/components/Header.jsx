import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCaretDown, FaSearch } from 'react-icons/fa';
import tmdbApi from '../api/tmdbApi';
import { useAuth } from '../context/AuthContext';

const headerNav = [
    { display: 'Home', path: '/' },
    { display: 'Movies', path: '/movie' },
    { display: 'TV Series', path: '/tv' }
];

// 👇 DANH SÁCH QUỐC GIA (Bạn có thể thêm tùy thích)
const countries = [
    { code: "US", name: "America" },
    { code: "KR", name: "Korea" },
    { code: "CN", name: "China" },
    { code: "VN", name: "Vietnam" },
    { code: "JP", name: "Japan" },
    { code: "TH", name: "Thailand" },
    { code: "GB", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "IN", name: "India" },
];

// 👇 TẠO DANH SÁCH NĂM (Từ năm nay lùi về 2000)
const currentYear = new Date().getFullYear();
const years = Array.from(new Array(25), (val, index) => currentYear - index);

const Header = () => {
    // ... (Giữ nguyên toàn bộ logic state, useEffect, search, auth của bạn)
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const { user, logout, openModal } = useAuth(); 
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const [genres, setGenres] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const active = headerNav.findIndex(e => e.path === pathname);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        const fetchGenres = async () => {
            try { setGenres(await tmdbApi.getGenres('movie')); } catch (e) { console.log(e); }
        };
        fetchGenres();
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearch(false);
            if (menuRef.current && !menuRef.current.contains(event.target)) setShowUserMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const getSuggestions = async () => {
            if (keyword.trim().length > 1) {
                try {
                    const response = await tmdbApi.searchMulti(keyword);
                    setSearchResults(response.results.filter(i=>i.media_type!=='person').slice(0, 5));
                    setShowSearch(true);
                } catch (e) { console.error(e); }
            } else { setSearchResults([]); setShowSearch(false); }
        };
        const timeout = setTimeout(() => getSuggestions(), 300);
        return () => clearTimeout(timeout);
    }, [keyword]);

    const handleGoToSearchPage = () => {
        if (keyword.trim()) { setShowSearch(false); navigate(`/search/${keyword}`); setKeyword(''); }
    };
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleGoToSearchPage(); };
    const handleLogout = () => { logout(); setShowUserMenu(false); navigate('/'); };

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ease-in-out hidden md:flex ${isScrolled ? 'bg-black/95 shadow-xl' : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'}`}>
                <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center px-4 h-full">
                    
                    <div className="flex items-center gap-12 h-full">
                        <Link to="/" className="flex items-center gap-2 group h-full">
                            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover group-hover:brightness-110 transition" />
                            <span className="font-bold text-white text-3xl tracking-wider group-hover:text-red-600 transition">MoiMovies</span>
                        </Link>

                        <ul className="flex items-center space-x-6 h-full">
                            {headerNav.map((e, i) => (
                                <li key={i} className="relative group h-full flex items-center">
                                    <Link to={e.path} className={`text-sm font-bold uppercase tracking-wide transition-colors duration-300 ${i === active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                                        {e.display}
                                    </Link>
                                    <span className={`absolute bottom-5 left-0 w-full h-0.5 bg-red-600 transform transition-transform duration-300 ${i === active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </li>
                            ))}
                            
                            {/* --- MỤC GENRES --- */}
                            <li className="relative group h-full flex items-center cursor-pointer">
                                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-400 hover:text-white transition">
                                    Genres <FaCaretDown className="text-xs" />
                                </span>
                                <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-[450px]">
                                    <div className="bg-black/95 p-6 rounded-xl shadow-2xl grid grid-cols-3 gap-4 border border-gray-800 backdrop-blur-xl">
                                        {genres.map((item) => (
                                            <Link key={item.id} to={`/genre/${item.id}`} className="text-xs text-gray-400 hover:text-red-500 transition hover:translate-x-1 duration-200">
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            {/* --- MỤC COUNTRY (MỚI) --- */}
                            <li className="relative group h-full flex items-center cursor-pointer">
                                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-400 hover:text-white transition">
                                    Country <FaCaretDown className="text-xs" />
                                </span>
                                <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-[350px]">
                                    <div className="bg-black/95 p-6 rounded-xl shadow-2xl grid grid-cols-3 gap-4 border border-gray-800 backdrop-blur-xl">
                                        {countries.map((item) => (
                                            <Link key={item.code} to={`/country/${item.code}`} className="text-xs text-gray-400 hover:text-red-500 transition hover:translate-x-1 duration-200">
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            {/* --- MỤC YEAR (MỚI) --- */}
                            <li className="relative group h-full flex items-center cursor-pointer">
                                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-400 hover:text-white transition">
                                    Year <FaCaretDown className="text-xs" />
                                </span>
                                <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-[300px]">
                                    <div className="bg-black/95 p-6 rounded-xl shadow-2xl grid grid-cols-4 gap-3 border border-gray-800 backdrop-blur-xl max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {years.map((year) => (
                                            <Link key={year} to={`/year/${year}`} className="text-xs text-center text-gray-400 hover:text-white hover:bg-red-600 rounded py-1 transition duration-200">
                                                {year}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                    {/* --- RIGHT: SEARCH + USER (Giữ nguyên) --- */}
                    <div className="flex items-center gap-6">
                        <div className="relative" ref={searchRef}>
                            <div className={`flex items-center rounded-full px-3 py-2 border transition-colors w-64 ${isScrolled ? 'bg-gray-900 border-gray-700' : 'bg-black/40 border-white/20'}`}>
                                <FaSearch className="text-gray-400 mr-3 text-sm" />
                                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-400" value={keyword} onChange={(e) => setKeyword(e.target.value)} onFocus={() => keyword.length > 1 && setShowSearch(true)} onKeyDown={handleKeyDown} />
                            </div>
                            {showSearch && searchResults.length > 0 && (
                                <div className="absolute top-full right-0 mt-3 w-80 bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {searchResults.map((movie) => (
                                            <div key={movie.id} onClick={() => { navigate(movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`); setShowSearch(false); setKeyword(''); }} className="flex items-start p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800/50 transition">
                                                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/50x75'} className="w-10 h-14 object-cover rounded-md mr-3"/>
                                                <div><h4 className="text-white text-xs font-bold line-clamp-1">{movie.title || movie.name}</h4><p className="text-gray-500 text-[10px] mt-1">{movie.release_date?.substring(0, 4)}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div onClick={handleGoToSearchPage} className="bg-red-700 text-white text-center py-3 text-xs font-bold cursor-pointer hover:bg-red-600 transition">View all results</div>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => setShowUserMenu(!showUserMenu)}>
                                    <img src={user.avatar || "https://animevietsub.show/statics/images/user-image.png"} className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-red-600 transition shadow-md"/>
                                    <FaCaretDown className="text-white text-xs" />
                                </div>
                                {showUserMenu && (
                                    <div className="absolute top-full right-0 mt-3 w-52 bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-700 bg-white/5">
                                            <p className="text-white text-sm font-bold truncate">{user.fullName}</p>
                                            <p className="text-gray-400 text-[10px] truncate">{user.role}</p>
                                        </div>
                                        <ul className="text-sm text-gray-300 py-1">
                                            <li><Link to="/profile" className="block px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2" onClick={() => setShowUserMenu(false)}>👤 Account</Link></li>
                                            <li><Link to="/watchlist" className="block px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2" onClick={() => setShowUserMenu(false)}>📺 Watchlist</Link></li>
                                            {user.role === 'ADMIN' && (<li><Link to="/admin" className="block px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2" onClick={() => setShowUserMenu(false)}>⚙️ Admin</Link></li>)}
                                            <li className="border-t border-gray-700 mt-1"><button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-600/10 hover:text-red-400 font-semibold transition">Sign out</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => openModal('login')} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition shadow-lg">Sign In</button>
                        )}
                    </div>
                </div>
            </div>
            {/* MOBILE: Bạn có thể thêm các mục Country/Year vào menu mobile nếu muốn, nhưng để đơn giản thì giữ nguyên như cũ */}
        </>
    );
}

export default Header;