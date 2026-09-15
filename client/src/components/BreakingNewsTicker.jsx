import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { AlertCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const BreakingNewsTicker = () => {
  const { language } = useSelector((state) => state.theme);
  const [breakingNews, setBreakingNews] = useState([]);

  const fetchBreaking = async () => {
    try {
      // First try dedicated breaking news ticker API
      const res = await axios.get('/api/breaking-news/active');
      if (res.data.success && res.data.breakingNews.length > 0) {
        setBreakingNews(res.data.breakingNews);
        return;
      }
      // Fallback to breaking news articles
      const newsRes = await axios.get('/api/news?breaking=true&limit=5');
      if (newsRes.data.success && newsRes.data.news.length > 0) {
        setBreakingNews(newsRes.data.news);
      }
    } catch (err) {
      console.error('Error fetching breaking news ticker', err);
    }
  };

  useEffect(() => {
    fetchBreaking();

    // Socket listener for live breaking news push notifications
    const socketBackend = import.meta.env.VITE_API_BASE_URL || 'https://idea-news-backend.onrender.com';
    const socket = io(socketBackend);
    socket.on('breaking_news', (newItem) => {
      setBreakingNews((prev) => [newItem, ...prev.slice(0, 9)]);
    });

    return () => socket.disconnect();
  }, []);

  const getFallbacks = () => [
    { _id: 'f1', title: 'ALERT: Central bank holds repo rates steady at 6.50% pointing to inflation control.' },
    { _id: 'f2', title: 'WEATHER UPDATE: IMD issues red alert warning for severe heavy rainfall in coastal regions.' },
    { _id: 'f3', title: 'SPORTS: Cricket squad announced for upcoming bilateral series; key pacers rested.' },
    { _id: 'f4', title: 'TECH TRENDS: AI development framework released supporting full edge offline language modeling.' },
  ];

  const items = breakingNews.length > 0 ? breakingNews : getFallbacks();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white flex items-stretch text-xs select-none">
      <div className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2.5 flex items-center gap-1.5 z-10 flex-shrink-0 animate-pulse cursor-pointer">
        <Zap className="h-4 w-4 fill-white" />
        <span>{language === 'Hindi' ? 'ब्रेकिंग न्यूज़' : 'BREAKING NEWS'}</span>
      </div>
      <div className="relative flex-1 flex items-center overflow-hidden bg-slate-950 font-medium">
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="flex gap-16 whitespace-nowrap animate-marquee py-2">
          {items.map((item, idx) => {
            const headline = language === 'English' && item.titleEn ? item.titleEn : item.title;
            return (
              <div key={item._id || idx} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                {item.slug ? (
                  <Link to={`/news/${item.slug}`} className="font-extrabold text-xs">{headline}</Link>
                ) : item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="font-extrabold text-xs hover:underline">{headline}</a>
                ) : (
                  <span className="font-bold text-xs">{headline}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
