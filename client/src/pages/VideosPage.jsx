import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Play, Pause, X, ChevronUp, ChevronDown, Volume2, VolumeX, Eye, Calendar, Sparkles } from 'lucide-react';
import logo from '/logo.png';
import { getMediaUrl } from '../utils/mediaUtils.js';

const VideosPage = () => {
  const { language } = useSelector((state) => state.theme);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef(null);

  const categories = [
    { en: 'All', hi: 'सभी' },
    { en: 'National', hi: 'राष्ट्रीय' },
    { en: 'Technology', hi: 'टेक' },
    { en: 'Sports', hi: 'खेल' },
    { en: 'Crime', hi: 'क्राइम' },
    { en: 'Entertainment', hi: 'मनोरंजन' },
  ];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/media/videos');
      if (res.data.success && res.data.videos.length > 0) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Failed to fetch videos from backend', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtered videos list by active category pill
  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter((v) => v.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Handle opening player modal
  const handleOpenPlayer = (index) => {
    setActiveVideoIndex(index);
    setIsPlaying(true);
    const video = filteredVideos[index];
    if (video?._id) {
      axios.post(`/api/media/videos/${video._id}/views`).catch(() => {});
    }
  };

  const handleClosePlayer = () => {
    setActiveVideoIndex(null);
    setIsPlaying(false);
  };

  const handleNextVideo = () => {
    if (activeVideoIndex !== null && activeVideoIndex < filteredVideos.length - 1) {
      handleOpenPlayer(activeVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (activeVideoIndex !== null && activeVideoIndex > 0) {
      handleOpenPlayer(activeVideoIndex - 1);
    }
  };

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.pause();
      } else {
        modalVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const activeVideo = activeVideoIndex !== null ? filteredVideos[activeVideoIndex] : null;

  return (
    <div className="bg-[#0b0e14] dark:bg-slate-950 text-white min-h-screen py-6 px-3 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header (Dainik Bhaskar Style) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-orange-500 rounded-full flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'Hindi' ? 'वीडियो स्टोरीज़' : 'Video Stories'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-semibold">
            {language === 'Hindi'
              ? 'लेटेस्ट ट्रेंडिंग शॉर्ट वीडियोज़ और ग्राउंड रिपोर्टिंग क्लिप्स'
              : 'Watch breaking video shorts & field reporting clips'}
          </p>
        </div>

        {/* ── Category Pills Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.en}
              onClick={() => setSelectedCategory(cat.en)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border
                ${selectedCategory === cat.en
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'}`}
            >
              {language === 'Hindi' ? cat.hi : cat.en}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVideos.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
            {language === 'Hindi'
              ? 'इस केटेगरी में कोई वीडियो अपलोड नहीं हुआ है।'
              : 'No video stories published in this category yet.'}
          </div>
        )}

        {/* ── Video Shorts Grid (Matching Dainik Bhaskar Screenshot) ── */}
        {!loading && filteredVideos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((v, idx) => (
              <div
                key={v._id}
                onClick={() => handleOpenPlayer(idx)}
                className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 border border-slate-800/90 shadow-2xl group cursor-pointer hover:border-orange-500/70 transition-all duration-300 flex flex-col justify-between p-3.5 select-none"
              >
                {/* Background Video Preview / Poster */}
                <video
                  src={getMediaUrl(v.url)}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  muted
                  preload="metadata"
                />

                {/* Gradient Overlays for High Contrast */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/95 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none" />

                {/* Top Overlay: Title & Logo */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <img src={logo} alt="IDEACITI" className="h-4 w-auto object-contain bg-black/60 px-1 py-0.5 rounded border border-white/10" />
                    <span className="text-[10px] font-extrabold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-1.5 py-0.5 rounded">
                      {v.category || 'News'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-yellow-300 line-clamp-2 leading-snug drop-shadow-md">
                    {v.title}
                  </h3>
                </div>

                {/* Center Overlay: Play Button Circle */}
                <div className="relative z-10 self-center my-auto">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-300 shadow-2xl">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Overlay: Yellow Headline, Description & Date/Duration */}
                <div className="relative z-10 space-y-1.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-yellow-300 line-clamp-2 leading-tight drop-shadow">
                    {v.title}
                  </h4>
                  {v.description && (
                    <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed opacity-90 drop-shadow-sm">
                      {v.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold border-t border-white/15 pt-1.5 mt-1">
                    <span className="bg-black/70 border border-white/20 px-1.5 py-0.5 rounded font-mono text-white">
                      0:45
                    </span>
                    <span className="flex items-center gap-1 opacity-80">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      {new Date(v.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── Full Shorts / Reel Interactive Player Modal ── */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm sm:max-w-md h-full sm:h-[88vh] bg-slate-950 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">

            {/* Video Player */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={modalVideoRef}
                src={getMediaUrl(activeVideo.url)}
                autoPlay
                playsInline
                muted={isMuted}
                loop
                onClick={togglePlayPause}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Top Header Controls Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white z-20">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="IDEACITI" className="h-5 w-auto object-contain bg-black/60 px-1.5 py-0.5 rounded border border-white/20" />
                  <span className="text-xs font-extrabold text-amber-300">{activeVideo.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleClosePlayer}
                    className="p-2 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Play/Pause Overlay indicator when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur border border-white/30 flex items-center justify-center text-white">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Navigation Up / Down Arrow buttons for Next / Prev Video */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                <button
                  onClick={handlePrevVideo}
                  disabled={activeVideoIndex === 0}
                  className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-orange-500 transition-all disabled:opacity-30 disabled:hover:bg-black/60 shadow-xl"
                  title="Previous Video"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextVideo}
                  disabled={activeVideoIndex === filteredVideos.length - 1}
                  className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-orange-500 transition-all disabled:opacity-30 disabled:hover:bg-black/60 shadow-xl"
                  title="Next Video"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Details & Caption Overlay */}
            <div className="p-4 bg-gradient-to-t from-black via-slate-950 to-transparent text-white space-y-2 border-t border-slate-800/80">
              <h3 className="font-extrabold text-sm sm:text-base text-yellow-300 leading-snug">
                {activeVideo.title}
              </h3>
              {activeVideo.description && (
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {activeVideo.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-orange-400" />{activeVideo.views || 0} views</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(activeVideo.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
