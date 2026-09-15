import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { toggleTheme, setLanguage } from '../redux/themeSlice.js';
import { Search, Tv, BookOpen, Sun, Moon, Bell, User, LogOut, ChevronDown, MapPin, Home, Video, Newspaper, Menu, X, Sparkles, Globe } from 'lucide-react';

// The separate admin panel app (news/video/e-paper uploads etc). Update
// this if you deploy it to a different URL.
const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_URL || 'https://idea-news-admin.onrender.com';
const STAFF_ROLES = ['Journalist', 'Editor', 'Advertiser', 'Admin', 'Super Admin'];
import logo from '/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode, language } = useSelector((state) => state.theme);

  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [activeState, setActiveState] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [activeDistrict, setActiveDistrict] = useState('');
  const [searchParams] = useSearchParams();

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const stateRef = useRef(null);

  const notifications = [
    'Breaking: Stock market rises 400 pts.',
    'Weather Alert: Heavy rain forecasted tomorrow.',
    'Politics: Election dates announced for state assembly.',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?search=${searchVal}`);
      setShowSearch(false);
    }
  };

  const categories = [
    { en: 'National', hi: 'राष्ट्रीय', icon: null },
    { en: 'International', hi: 'अंतरराष्ट्रीय', icon: null },
    { en: 'Politics', hi: 'राजनीति', icon: null },
    { en: 'Crime', hi: 'क्राइम', icon: null },
    { en: 'Sports', hi: 'खेल', icon: null },
    { en: 'Business', hi: 'बिज़नेस', icon: null },
    { en: 'Technology', hi: 'टेक', icon: null },
    { en: 'Entertainment', hi: 'मनोरंजन', icon: null },
    { en: 'Lifestyle', hi: 'लाइफस्टाइल', icon: null },
    { en: 'Astrology', hi: 'धर्म-राशि', icon: null },
    { en: 'Opinion', hi: 'ओपिनियन', icon: null },
    { en: 'Videos', hi: 'वीडियो', icon: null },
  ];

  const stateHierarchy = {
    'Uttar Pradesh': {
      cities: {
        Ghaziabad: ['Indirapuram', 'Vasundhara', 'Vaishali'],
        Noida: ['Sector 62', 'Sector 15', 'Noida Extension'],
        Lucknow: ['Hazratganj', 'Gomti Nagar', 'Alambagh'],
        Kanpur: ['Kalyanpur', 'Civil Lines'],
      },
    },
    'Madhya Pradesh': {
      cities: {
        Indore: ['Vijay Nagar', 'Palasia', 'Rajwada'],
        Bhopal: ['Arera Colony', 'MP Nagar', 'Kolar'],
        Gwalior: ['Lashkar', 'Morar'],
      },
    },
    Rajasthan: {
      cities: {
        Jaipur: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme'],
        Jodhpur: ['Sardarpura', 'Shastri Nagar'],
        Udaipur: ['Fatehsagar', 'Hiran Magri'],
      },
    },
    Maharashtra: {
      cities: {
        Mumbai: ['Andheri', 'Bandra', 'Colaba', 'Borivali'],
        Pune: ['Kothrud', 'Koregaon Park', 'Shivajinagar'],
        Nagpur: ['Dharampeth', 'Sadashivnagar'],
      },
    },
  };

  const selectedCategory = searchParams.get('category');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (cat) => {
    setActiveState(''); setActiveCity(''); setActiveDistrict('');
    setMobileMenuOpen(false);
    navigate(`/?category=${cat}`);
  };

  const handleStateSelect = (stateName) => {
    setActiveState(stateName); setActiveCity(''); setActiveDistrict('');
    setShowStateDropdown(false);
    setMobileMenuOpen(false);
    navigate(`/?state=${stateName}`);
  };

  const handleCitySelect = (cityName) => {
    setActiveCity(cityName); setActiveDistrict('');
    setMobileMenuOpen(false);
    navigate(`/?state=${activeState}&city=${cityName}`);
  };

  const handleDistrictSelect = (dst) => {
    setActiveDistrict(dst);
    setMobileMenuOpen(false);
    navigate(`/?state=${activeState}&city=${activeCity}&district=${dst}`);
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-[100] shadow-xs transition-colors duration-200">

        <div className="max-w-7xl mx-auto h-14 md:h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2">

          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="IDEACITI News" className="h-9 sm:h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Center/Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-7">

            {/* 🏠 Home */}
            <Link
              to="/"
              onClick={() => {
                setActiveState(''); setActiveCity(''); setActiveDistrict('');
              }}
              className={`flex items-center gap-1.5 text-base lg:text-[17px] font-bold transition-colors py-2 whitespace-nowrap
                ${!selectedCategory && !activeState
                  ? 'text-orange-500 font-extrabold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
            >
              <Home className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              <span>{language === 'Hindi' ? 'होम' : 'Home'}</span>
            </Link>

            {/* 🎬 Video */}
            <Link
              to="/videos"
              className={`flex items-center gap-1.5 text-base lg:text-[17px] font-bold transition-colors py-2 whitespace-nowrap
                ${window.location.hash.includes('/videos')
                  ? 'text-orange-500 font-extrabold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
            >
              <Video className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>{language === 'Hindi' ? 'वीडियो' : 'Video'}</span>
            </Link>

            {/* 📺 Watch (Live TV) */}
            <Link
              to="/livetv"
              className={`flex items-center gap-1.5 text-base lg:text-[17px] font-bold transition-colors py-2 whitespace-nowrap
                ${window.location.hash.includes('/livetv')
                  ? 'text-red-600 font-extrabold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-red-600'}`}
            >
              <Tv className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
              <span>{language === 'Hindi' ? 'वॉच' : 'Live TV'}</span>
            </Link>

            {/* 📰 E-Paper */}
            <Link
              to="/epaper"
              className={`flex items-center gap-1.5 text-base lg:text-[17px] font-bold transition-colors py-2 whitespace-nowrap
                ${window.location.hash.includes('/epaper')
                  ? 'text-orange-500 font-extrabold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
            >
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>{language === 'Hindi' ? 'ई-पेपर' : 'E-Paper'}</span>
            </Link>

          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* Search Bar / Icon */}
            <div className="relative flex items-center">
              {showSearch ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onBlur={() => { if (!searchVal) setShowSearch(false); }}
                    placeholder={language === 'Hindi' ? 'खोजें...' : 'Search...'}
                    className="w-32 sm:w-44 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-full pl-3 pr-7 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="absolute right-2 text-slate-400 hover:text-orange-500">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-500 transition-colors"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-[11px] font-extrabold shadow-2xs">
              <button
                onClick={() => dispatch(setLanguage('English'))}
                className={`px-2 py-1 transition-colors ${language === 'English' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                EN
              </button>
              <button
                onClick={() => dispatch(setLanguage('Hindi'))}
                className={`px-2 py-1 transition-colors ${language === 'Hindi' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                हिं
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Account / Profile Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/10 text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[70px] truncate hidden sm:inline text-xs font-bold">{user?.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 hidden sm:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1 z-50 w-48">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    {STAFF_ROLES.includes(user?.role) ? (
                      <a
                        href={ADMIN_PANEL_URL}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-500 transition-colors"
                      >
                        <User className="h-4 w-4" /> Admin Panel
                      </a>
                    ) : (
                      <Link
                        to="/dashboard/reader"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-500 transition-colors"
                      >
                        <User className="h-4 w-4" /> My Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { dispatch(logout()); navigate('/'); setShowUserMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm transition-colors whitespace-nowrap"
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{language === 'Hindi' ? 'लॉग इन' : 'Login'}</span>
              </Link>
            )}

          </div>

        </div>

        {/* ── State City/District Sub-bar ── */}
        {activeState && (
          <div className="bg-orange-50 dark:bg-orange-950/20 border-t border-orange-100 dark:border-orange-900/30 py-1.5 px-3 sm:px-4 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto flex items-center gap-2 whitespace-nowrap text-xs">
              <span className="font-bold text-white text-[10px] bg-orange-500 px-2 py-0.5 rounded uppercase tracking-widest flex-shrink-0">{activeState}</span>
              {Object.keys(stateHierarchy[activeState]?.cities || {}).map((cty) => (
                <button
                  key={cty}
                  onClick={() => handleCitySelect(cty)}
                  className={`px-2 py-0.5 rounded transition-colors font-semibold flex-shrink-0
                    ${activeCity === cty ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-slate-400 hover:text-orange-500'}`}
                >
                  {cty}
                </button>
              ))}
              {activeCity && stateHierarchy[activeState]?.cities?.[activeCity] && (
                <>
                  <span className="text-gray-300 dark:text-slate-600">|</span>
                  {stateHierarchy[activeState].cities[activeCity].map((dst) => (
                    <button
                      key={dst}
                      onClick={() => handleDistrictSelect(dst)}
                      className={`px-2 py-0.5 rounded transition-colors flex-shrink-0
                        ${activeDistrict === dst ? 'bg-orange-500 text-white font-bold' : 'text-gray-500 dark:text-slate-500 hover:text-orange-500'}`}
                    >
                      {dst}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

      </header>

      {/* ── Mobile Off-Canvas Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu Sheet */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-slate-200 dark:border-slate-800">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <img src={logo} alt="IDEACITI" className="h-8 w-auto object-contain" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-4 space-y-5 flex-1">

              {/* State City Selector in Drawer */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {language === 'Hindi' ? 'अपना राज्य चुनें' : 'Select State'}
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {Object.keys(stateHierarchy).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStateSelect(st)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-bold transition-colors border
                        ${activeState === st
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Navigation */}
              <div className="space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'Hindi' ? 'श्रेणियां (Categories)' : 'Categories'}
                </p>
                {categories.map((c) => (
                  <button
                    key={c.en}
                    onClick={() => handleCategoryClick(c.en)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors
                      ${selectedCategory === c.en
                        ? 'bg-orange-500 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <span>{language === 'Hindi' ? c.hi : c.en}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 opacity-60" />
                  </button>
                ))}
              </div>

            </div>

            {/* Footer / Login Link in Drawer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { dispatch(logout()); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full py-2 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <User className="h-4 w-4" /> {language === 'Hindi' ? 'लॉग इन करें' : 'Login / Register'}
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Fixed Mobile Bottom Navigation Bar (App-like UX on Mobile) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 py-1.5 px-2 flex items-center justify-around shadow-lg">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors
            ${!selectedCategory && !window.location.hash.includes('/videos') && !window.location.hash.includes('/livetv') && !window.location.hash.includes('/epaper')
              ? 'text-orange-500'
              : 'text-slate-600 dark:text-slate-400'}`}
        >
          <Home className="h-5 w-5" />
          <span>{language === 'Hindi' ? 'होम' : 'Home'}</span>
        </Link>

        <Link
          to="/videos"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors
            ${window.location.hash.includes('/videos') ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}
        >
          <Video className="h-5 w-5" />
          <span>{language === 'Hindi' ? 'वीडियो' : 'Shorts'}</span>
        </Link>

        <Link
          to="/livetv"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors
            ${window.location.hash.includes('/livetv') ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`}
        >
          <Tv className="h-5 w-5 text-red-600" />
          <span>{language === 'Hindi' ? 'लाइव TV' : 'Live TV'}</span>
        </Link>

        <Link
          to="/epaper"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors
            ${window.location.hash.includes('/epaper') ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}
        >
          <BookOpen className="h-5 w-5" />
          <span>{language === 'Hindi' ? 'ई-पेपर' : 'E-Paper'}</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span>{language === 'Hindi' ? 'मेन्यू' : 'Menu'}</span>
        </button>
      </nav>
    </>
  );
};

export default Header;
