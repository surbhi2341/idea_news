import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header.jsx';
import BreakingNewsTicker from './components/BreakingNewsTicker.jsx';

// Pages
import Home from './pages/Home.jsx';
import NewsDetails from './pages/NewsDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VideosPage from './pages/VideosPage.jsx';
import WatchPage from './pages/WatchPage.jsx';

// Dashboards
import ReaderDashboard from './pages/ReaderDashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import { Play, Calendar, Download, Eye, FileText, Video as VideoIcon, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import logo from '/logo.png';

import { getMediaUrl } from './utils/mediaUtils.js';

// E-Paper Page Layout
const EPaperPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/epaper')
      .then((res) => setIssues(res.data.epapers || []))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-4 sm:py-6 pb-20 md:pb-8 transition-colors">
      <div className="max-w-6xl w-full mx-auto px-3 sm:px-4 space-y-6">
        <div className="border-l-4 border-red-650 pl-3">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight uppercase">E-Paper</h2>
          <p className="text-xs text-slate-400">Read print edition replica newspapers offline.</p>
        </div>

        {loading && <p className="text-xs text-slate-400">Loading editions...</p>}
        {!loading && issues.length === 0 && (
          <p className="text-xs text-slate-400">No e-paper editions published yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-xs font-semibold">
          {issues.map((ep) => (
            <div key={ep._id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <img
                  src={ep.coverImage ? getMediaUrl(ep.coverImage) : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=300&h=420&fit=crop'}
                  alt=""
                  className="w-full h-64 object-cover rounded border dark:border-slate-800"
                />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{ep.edition}</h3>
                <p className="text-slate-400 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(ep.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t dark:border-slate-800">
                <a href={getMediaUrl(ep.pdfUrl)} target="_blank" rel="noreferrer" download className="flex-1 bg-red-600 hover:bg-red-750 text-white font-extrabold py-2 rounded text-center flex items-center justify-center gap-1"><Download className="h-3.5 w-3.5" />Download</a>
                <a href={getMediaUrl(ep.pdfUrl)} target="_blank" rel="noreferrer" className="bg-slate-100 dark:bg-slate-800 p-2 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-500"><Eye className="h-4 w-4" /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════ SITE FOOTER ══════════════
const SiteFooter = () => {
  const [recentPosts, setRecentPosts] = React.useState([]);

  React.useEffect(() => {
    axios.get('/api/news?limit=3&status=Published')
      .then(res => { if (res.data.success) setRecentPosts(res.data.news || []); })
      .catch(() => { });
  }, []);

  const categories = [
    'National', 'Politics', 'Sports', 'Business',
    'Entertainment', 'Technology', 'Health', 'Education',
    'Investigation', 'Crime', 'International', 'Lifestyle',
  ];

  const popularTags = [
    'Bihar', 'Patna', 'Modi', 'Cricket', 'Sensex',
    'Education', 'Weather', 'Movie', 'Election', 'Police',
    'Train', 'Infrastructure', 'Budget', 'Health', 'Science',
  ];

  return (
    <footer className="bg-[#111111] text-gray-400 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* ── Column 1: Logo + Info ── */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="mb-3">
              <Link to="/">
                <img
                  src={logo}
                  alt="IDEACITI News Network"
                  className="h-16 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            <p className="text-gray-500 text-s leading-relaxed">
              Magazines cover a wide subjects, including not limited to fashion, lifestyle, health, politics, business, Entertainment, sports, science,
            </p>

            <div className="space-y-2 text-s text-gray-500">
              <p><span className="text-gray-300 font-semibold">CIN :</span> U18200BR2023PTC062110</p>
              <p><span className="text-gray-300 font-semibold">Grievance Officer Contact :</span> 8829049947</p>
              <p><span className="text-gray-300 font-semibold">Desk Room :</span> +91 9142991481</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a href="https://www.facebook.com/ideacitinewsnetwork/" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a href="https://x.com/ideacitinews" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a href="https://www.youtube.com/@IdeaCitiNews" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* ── Column 2: Categories ── */}
          <div>
            <h4 className="text-white font-black text-sm mb-5 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/?category=${cat}`}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Recent Posts ── */}
          <div>
            <h4 className="text-white font-black text-sm mb-5 uppercase tracking-wider">Recent Posts</h4>
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                // Skeleton placeholders while loading
                [1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-12 bg-gray-800 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-800 rounded w-full" />
                      <div className="h-3 bg-gray-800 rounded w-2/3" />
                    </div>
                  </div>
                ))
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/news/${post.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 font-semibold leading-snug line-clamp-2 group-hover:text-white transition-colors">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ── Column 4: Popular Tags ── */}
          <div>
            <h4 className="text-white font-black text-sm mb-5 uppercase tracking-wider">Popular Tags</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/?search=${tag}`}
                  className="text-[10px] font-bold text-gray-500 border border-gray-700 hover:border-red-600 hover:text-red-500 px-2.5 py-1 rounded transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-600">
          <p>© 2026 Ideaciti News Network Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">Terms of Use</Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">Advertise</Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">

        <Header />
        <BreakingNewsTicker />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news/:slug" element={<NewsDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/livetv" element={<WatchPage />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/epaper" element={<EPaperPage />} />
            <Route path="/videos" element={<VideosPage />} />

            {/* Reader Dashboard */}
            <Route
              path="/dashboard/reader"
              element={
                <ProtectedRoute allowedRoles={['Reader']}>
                  <ReaderDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <SiteFooter />

      </div>
    </Router>
  );
};

export default App;
