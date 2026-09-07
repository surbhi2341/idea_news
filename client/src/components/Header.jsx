import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { toggleTheme, setLanguage } from '../redux/themeSlice.js';
import { Search, Tv, BookOpen, Sun, Moon, Bell, User, LogOut, ChevronDown, MapPin, Home, Video, Newspaper } from 'lucide-react';

// The separate admin panel app (news/video/e-paper uploads etc). Update
// this if you deploy it to a different URL.
const ADMIN_PANEL_URL = 'http://localhost:3001';
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

  const handleCategoryClick = (cat) => {
    setActiveState(''); setActiveCity(''); setActiveDistrict('');
    navigate(`/?category=${cat}`);
  };

  const handleStateSelect = (stateName) => {
    setActiveState(stateName); setActiveCity(''); setActiveDistrict('');
    setShowStateDropdown(false);
    navigate(`/?state=${stateName}`);
  };

  const handleCitySelect = (cityName) => {
    setActiveCity(cityName); setActiveDistrict('');
    navigate(`/?state=${activeState}&city=${cityName}`);
  };

  const handleDistrictSelect = (dst) => {
    setActiveDistrict(dst);
    navigate(`/?state=${activeState}&city=${activeCity}&district=${dst}`);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-[100] shadow-sm transition-colors duration-200">

      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img src={logo} alt="IDEACITI News" className="h-11 md:h-12 w-auto object-contain" />
        </Link>

        {/* ── Unified Horizontal Navigation Group ── */}
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">

          {/* 🏠 Home */}
          <Link
            to="/"
            onClick={() => {
              setActiveState(''); setActiveCity(''); setActiveDistrict('');
            }}
            className={`flex items-center gap-2 text-[18px] md:text-[18px] font-bold transition-colors py-2 whitespace-nowrap
              ${!selectedCategory && !activeState
                ? 'text-orange-500 font-extrabold'
                : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
          >
            <Home className="h-5 w-5 text-orange-500" />
            <span>{language === 'Hindi' ? 'होम' : 'Home'}</span>
          </Link>

          {/* 🎬 Video */}
          <Link
            to="/videos"
            className={`flex items-center gap-2 text-[18px] md:text-[18px] font-bold transition-colors py-2 whitespace-nowrap
              ${window.location.hash.includes('/videos')
                ? 'text-orange-500 font-extrabold'
                : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
          >
            <Video className="h-5 w-5" />
            <span>{language === 'Hindi' ? 'वीडियो' : 'Video'}</span>
          </Link>

          {/* 🔍 Search */}
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
                  className="w-36 md:w-44 text-sm border border-slate-300 dark:border-slate-600 rounded-full pl-3 pr-7 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
                <button type="submit" className="absolute right-2 text-slate-400 hover:text-orange-500">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 text-[18px] md:text-[18px] font-bold text-slate-800 dark:text-slate-200 hover:text-orange-500 transition-colors py-2 whitespace-nowrap"
              >
                <Search className="h-5 w-5" />
                <span>{language === 'Hindi' ? 'सर्च' : 'Search'}</span>
              </button>
            )}
          </div>

          {/* Thin Divider Line */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* 📺 Watch (Live TV) */}
          <Link
            to="/livetv"
            className={`flex items-center gap-2 text-[18px] md:text-[18px] font-bold transition-colors py-2 whitespace-nowrap
              ${window.location.hash.includes('/livetv')
                ? 'text-red-600 font-extrabold'
                : 'text-slate-800 dark:text-slate-200 hover:text-red-600'}`}
          >
            <Tv className="h-5 w-5 text-red-600" />
            <span>{language === 'Hindi' ? 'वॉच' : 'Live TV'}</span>
          </Link>

          {/* 📰 E-Paper */}
          <Link
            to="/epaper"
            className={`flex items-center gap-2 text-[15px] md:text-[18px] font-bold transition-colors py-2 whitespace-nowrap
              ${window.location.hash.includes('/epaper')
                ? 'text-orange-500 font-extrabold'
                : 'text-slate-800 dark:text-slate-200 hover:text-orange-500'}`}
          >
            <BookOpen className="h-5 w-5" />
            <span>{language === 'Hindi' ? 'ई-पेपर' : 'E-Paper'}</span>
          </Link>

          {/* Thin Divider Line */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

          {/* Language Toggle (EN / हिं) */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-extrabold shadow-2xs">
            <button
              onClick={() => dispatch(setLanguage('English'))}
              className={`px-2.5 py-1 transition-colors ${language === 'English' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              EN
            </button>
            <button
              onClick={() => dispatch(setLanguage('Hindi'))}
              className={`px-2.5 py-1 transition-colors ${language === 'Hindi' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              हिं
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Account Profile */}
          {isAuthenticated ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/10 text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[80px] truncate hidden md:inline text-sm">{user?.name}</span>
                <ChevronDown className="h-4 w-4 hidden md:block" />
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
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-4 py-2 rounded-full shadow-sm transition-colors whitespace-nowrap"
            >
              <User className="h-4 w-4" />
              <span>{language === 'Hindi' ? 'लॉग इन' : 'Login'}</span>
            </Link>
          )}

        </nav>
      </div>

      {/* ── State City/District Sub-bar ── */}
      {activeState && (
        <div className="bg-orange-50 dark:bg-orange-950/10 border-t border-orange-100 dark:border-orange-900/30 py-1.5 px-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-white text-[10px] bg-orange-500 px-2 py-0.5 rounded uppercase tracking-widest">{activeState}</span>
            {Object.keys(stateHierarchy[activeState]?.cities || {}).map((cty) => (
              <button
                key={cty}
                onClick={() => handleCitySelect(cty)}
                className={`px-2 py-0.5 rounded transition-colors font-semibold
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
                    className={`px-2 py-0.5 rounded transition-colors
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
  );
};

export default Header;
