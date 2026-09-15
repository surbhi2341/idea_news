import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUtils.js';

// ── Fallback banner slides shown when no active DB campaign is found ──
const FALLBACK_BANNERS = [
  {
    _id: 'fb1',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=140&fit=crop',
    title: 'Download IDEACITI App – Stay Informed Anywhere',
    redirectUrl: '#',
  },
  {
    _id: 'fb2',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=1200&h=140&fit=crop',
    title: 'Smart India 2026 – Building Tomorrow\'s Cities',
    redirectUrl: '#',
  },
  {
    _id: 'fb3',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&h=140&fit=crop',
    title: 'Business India Expo 2026 – Greater Noida',
    redirectUrl: '#',
  },
];

const AUTOPLAY_MS = 7000; // slide every 7 seconds

// ─────────────────────────────────────────────
//  BannerCarousel  – Dainik Bhaskar Clean Leaderboard
// ─────────────────────────────────────────────
const BannerCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (animating || idx === current) return;
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating, current]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [next, slides.length]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (slides.length > 1) {
      timerRef.current = setInterval(next, AUTOPLAY_MS);
    }
  };

  const handleClick = (slide) => {
    if (slide._id && !slide._id.startsWith('fb')) {
      axios.post(`/api/ads/id/${slide._id}/click`).catch(() => { });
    }
  };

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full flex justify-center items-center overflow-hidden group bg-transparent py-1"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* ── Slide Display ── */}
      <div className="relative w-full flex justify-center items-center min-h-[100px] sm:min-h-[100px]">
        {slides.map((slide, idx) => (
          <a
            key={slide._id}
            href={slide.redirectUrl || '#'}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleClick(slide)}
            className={`w-full flex justify-center items-center transition-opacity duration-500 ease-in-out ${idx === current
              ? 'opacity-100 relative z-10'
              : 'opacity-0 absolute inset-0 pointer-events-none z-0'
              }`}
          >
            <img
              src={getMediaUrl(slide.imageUrl)}
              alt={slide.title || 'Advertisement'}
              className="w-full max-w-[1200px] h-auto max-h-[130px] sm:max-h-[130px] md:max-h-[140px] object-contain rounded-s border border-slate-200/60 dark:border-slate-800"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </a>
        ))}
      </div>

      {/* ── Prev / Next arrows (hidden until hover) ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(idx); }}
              className={`rounded-full transition-all duration-300 ${idx === current
                ? 'bg-red-600 w-5 h-1.5 shadow'
                : 'bg-black/30 dark:bg-white/40 hover:bg-black/50 w-1.5 h-1.5'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  AdBanner  – main export
// ─────────────────────────────────────────────
const AdBanner = ({ type = 'Banner' }) => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get('/api/ads/active');
        if (res.data.success && res.data.ads.length > 0) {
          const filtered = res.data.ads.filter((a) => a.type === type);
          if (filtered.length > 0) {
            setSlides(filtered);
            filtered.forEach((ad) =>
              axios.post(`/api/ads/id/${ad._id}/view`).catch(() => { })
            );
            return;
          }
        }
      } catch (_) { }
      // fallback
      if (type === 'Banner') setSlides(FALLBACK_BANNERS);
    };
    fetchAds();
  }, [type]);

  // ── Sidebar (single image) ──
  if (type === 'Sidebar') {
    const ad = slides[0];
    if (!ad) return null;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center shadow-xs">
        <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">Sponsored</div>
        <a href={ad.redirectUrl || '#'} target="_blank" rel="noreferrer" className="block overflow-hidden rounded">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded object-contain max-h-[280px] mx-auto transition-transform duration-300 hover:scale-[1.01]" />
        </a>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold truncate">{ad.title}</div>
      </div>
    );
  }

  // ── Popup ──
  if (type === 'Popup') {
    const [hidden, setHidden] = useState(false);
    const ad = slides[0];
    if (!ad || hidden) return null;
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xl z-50 max-w-sm">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Advertisement</span>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-1 py-0.5 rounded" onClick={() => setHidden(true)}>✕</button>
        </div>
        <a href={ad.redirectUrl || '#'} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded-lg object-cover max-h-[180px] mx-auto" />
        </a>
        <div className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 font-bold">{ad.title}</div>
      </div>
    );
  }

  // ── Default: centered Clean Dainik Bhaskar Leaderboard ──
  return (
    <div className="w-full py-2 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
      <div className="max-w-[970px] mx-auto px-2 sm:px-4">
        <BannerCarousel slides={slides} />
      </div>
    </div>
  );
};

export default AdBanner;
