import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { LogOut, ExternalLink } from 'lucide-react';
import logo from '/logo.png';

// Where the public-facing reader site lives. Change this if you deploy
// the main site to a different URL.
const MAIN_SITE_URL = 'http://localhost:3000';

const AdminHeader = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ideaciti" className="h-7 w-auto" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">Admin Panel</span>
        </Link>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Main Site
          </a>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { dispatch(logout()); navigate('/login'); }}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
