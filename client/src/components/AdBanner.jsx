import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Fallback banner slides shown when no active DB campaign is found ──
const FALLBACK_BANNERS = [
  {
    _id: 'fb1',
    imageUrl: '/uploads/images/news_ad_banner.jpg',
    title: 'Download IDEACITI App – Stay Informed Anywhere',
    redirectUrl: '#',
  },
  {
    _id: 'fb2',
    imageUrl: '/uploads/images/ad_banner_2.jpg',
    title: 'Smart India 2026 – Building Tomorrow\'s Cities',
    redirectUrl: '#',
  },
  {
    _id: 'fb3',
    imageUrl: '/uploads/images/ad_banner_3.jpg',
    title: 'Business India Expo 2026 – Greater Noida',
    redirectUrl: '#',
  },
];

const AUTOPLAY_MS = 7000; // slide every 7 seconds

// ─────────────────────────────────────────────
//  BannerCarousel  – premium full-width slider
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
      setTimeout(() => setAnimating(false), 600);
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
    timerRef.current = setInterval(next, AUTOPLAY_MS);
  };

  const handleClick = (slide) => {
    if (slide._id && !slide._id.startsWith('fb')) {
      axios.post(`/api/ads/id/${slide._id}/click`).catch(() => {});
    }
  };

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900 group"
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{ aspectRatio: '728 / 90', minHeight: '90px', maxHeight: '160px' }}
    >
      {/* ── Slides ── */}
      {slides.map((slide, idx) => (
        <a
          key={slide._id}
          href={slide.redirectUrl || '#'}
          target="_blank"
          rel="noreferrer"
          onClick={() => handleClick(slide)}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            idx === current
              ? 'opacity-100 translate-x-0 z-10'
              : idx < current
              ? 'opacity-0 -translate-x-full z-0'
              : 'opacity-0 translate-x-full z-0'
          }`}
          style={{ display: 'block' }}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title || 'Advertisement'}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'high-quality' }}
            loading="eager"
            decoding="sync"
            draggable="false"
          />
        </a>
      ))}

      {/* ── Prev / Next arrows (hidden until hover) ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); goTo(idx); }}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'bg-orange-500 w-5 h-1.5'
                  : 'bg-white/60 hover:bg-white w-1.5 h-1.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── "Advertisement" label ── */}
      <span className="absolute top-1 right-2 text-[9px] text-white/60 uppercase tracking-widest z-20 font-semibold select-none">
        Advertisement
      </span>
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
            // register impressions
            filtered.forEach((ad) =>
              axios.post(`/api/ads/id/${ad._id}/view`).catch(() => {})
            );
            return;
          }
        }
      } catch (_) {}
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
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2 text-center shadow-sm">
        <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">Sponsored</div>
        <a href={ad.redirectUrl || '#'} target="_blank" rel="noreferrer">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded object-cover max-h-[300px]" />
        </a>
        <div className="text-[11px] text-slate-500 mt-1 truncate">{ad.title}</div>
      </div>
    );
  }

  // ── Popup ──
  if (type === 'Popup') {
    const [hidden, setHidden] = useState(false);
    const ad = slides[0];
    if (!ad || hidden) return null;
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-2xl z-50 max-w-sm">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-black">Advertisement</span>
          <button className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1" onClick={() => setHidden(true)}>✕</button>
        </div>
        <a href={ad.redirectUrl || '#'} target="_blank" rel="noreferrer">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded object-cover max-h-[160px]" />
        </a>
        <div className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium">{ad.title}</div>
      </div>
    );
  }

  // ── Default: centered Banner carousel (matches screenshot layout) ──
  return (
    <div className="w-full py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <BannerCarousel slides={slides} />
      </div>
    </div>
  );
};

export default AdBanner;
