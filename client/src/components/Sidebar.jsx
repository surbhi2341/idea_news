import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Flame,
  MapPin,
  Eye,
  Star,
  PenTool,
  Trophy,
  Film,
  GraduationCap,
  CircleDollarSign,
  ShoppingBag,
  BookOpen,
  Smartphone,
  Globe,
  Vote,
  ChevronRight,
  Activity
} from 'lucide-react';

const Sidebar = ({ onSelectStateModal }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useSelector((state) => state.theme);

  const currentCategory = searchParams.get('category');
  const currentState = searchParams.get('state');

  // State hierarchy modal / selector triggers
  const [showCityPicker, setShowCityPicker] = useState(false);

  const sidebarItems = [
    {
      id: 'top-news',
      nameHi: 'टॉप न्यूज़',
      nameEn: 'Top News',
      category: '',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
          <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
        </span>
      ),
    },
    {
      id: 'state-city',
      nameHi: 'राज्य-शहर',
      nameEn: 'State - City',
      isStateTrigger: true,
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
          <MapPin className="w-5 h-5 fill-red-500 text-red-500" />
        </span>
      ),
    },
    {
      id: 'investigation',
      nameHi: 'इन्वेस्टिगेशन',
      nameEn: 'Investigation',
      category: 'Investigation',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-600/10 text-red-600 group-hover:scale-110 transition-transform">
          <Eye className="w-5 h-5 text-red-600 fill-red-100 dark:fill-red-950" />
        </span>
      ),
    },
    {
      id: 'cricket',
      nameHi: 'क्रिकेट',
      nameEn: 'Cricket',
      category: 'Cricket',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 group-hover:scale-110 transition-transform">
          <Activity className="w-5 h-5 text-blue-600" />
        </span>
      ),
    },
    {
      id: 'special',
      nameHi: 'खास',
      nameEn: 'Khas',
      category: 'Special',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
        </span>
      ),
    },
    {
      id: 'db-original',
      nameHi: 'DB ओरिजिनल',
      nameEn: 'DB Original',
      category: 'DB Original',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-yellow-500/15 text-yellow-600 group-hover:scale-110 transition-transform">
          <PenTool className="w-5 h-5 text-yellow-600 fill-yellow-500/20" />
        </span>
      ),
    },
    {
      id: 'sports',
      nameHi: 'स्पोर्ट्स',
      nameEn: 'Sports',
      category: 'Sports',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 group-hover:scale-110 transition-transform">
          <Trophy className="w-5 h-5 text-sky-500" />
        </span>
      ),
    },
    {
      id: 'bollywood',
      nameHi: 'बॉलीवुड',
      nameEn: 'Bollywood',
      category: 'Bollywood',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
          <Film className="w-5 h-5 text-purple-500" />
        </span>
      ),
    },
    {
      id: 'job-education',
      nameHi: 'जॉब - एजुकेशन',
      nameEn: 'Job - Education',
      category: 'Job - Education',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700/10 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
          <GraduationCap className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </span>
      ),
    },
    {
      id: 'business',
      nameHi: 'बिजनेस',
      nameEn: 'Business',
      category: 'Business',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
          <CircleDollarSign className="w-5 h-5 text-emerald-600" />
        </span>
      ),
    },
    {
      id: 'lifestyle',
      nameHi: 'लाइफस्टाइल',
      nameEn: 'Lifestyle',
      category: 'Lifestyle',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 group-hover:scale-110 transition-transform">
          <ShoppingBag className="w-5 h-5 text-pink-500" />
        </span>
      ),
    },
    {
      id: 'jeevan-mantra',
      nameHi: 'जीवन मंत्र',
      nameEn: 'Jeevan Mantra',
      category: 'Jeevan Mantra',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-600/10 text-orange-600 group-hover:scale-110 transition-transform">
          <BookOpen className="w-5 h-5 text-orange-600" />
        </span>
      ),
    },
    {
      id: 'tech-auto',
      nameHi: 'टेक',
      nameEn: 'Technology',
      category: 'Technology',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:scale-110 transition-transform">
          <Smartphone className="w-5 h-5 text-indigo-500" />
        </span>
      ),
    },
    {
      id: 'world',
      nameHi: 'देश-विदेश',
      nameEn: 'World',
      category: 'World',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 group-hover:scale-110 transition-transform">
          <Globe className="w-5 h-5 text-teal-600" />
        </span>
      ),
    },
    {
      id: 'politics',
      nameHi: 'राजनीति',
      nameEn: 'Politics',
      category: 'Politics',
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 group-hover:scale-110 transition-transform">
          <Vote className="w-5 h-5 text-rose-500" />
        </span>
      ),
    },
  ];

  const handleItemClick = (item) => {
    if (item.isStateTrigger) {
      if (onSelectStateModal) {
        onSelectStateModal();
      } else {
        setShowCityPicker(!showCityPicker);
      }
      return;
    }

    if (!item.category) {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(item.category)}`);
    }
  };

  const isItemActive = (item) => {
    if (item.id === 'top-news' && !currentCategory && !currentState) return true;
    if (item.isStateTrigger && currentState) return true;
    if (!item.category || !currentCategory) return false;

    const cur = currentCategory.toLowerCase();
    const target = item.category.toLowerCase();

    if (cur === target) return true;
    if ((target === 'bollywood' && cur === 'entertainment') || (target === 'entertainment' && cur === 'bollywood')) return true;
    if ((target === 'jeevan mantra' && cur === 'astrology') || (target === 'astrology' && cur === 'jeevan mantra')) return true;
    if ((target === 'world' && cur === 'international') || (target === 'international' && cur === 'world')) return true;
    if ((target === 'job - education' && (cur === 'education' || cur === 'job-education')) || (target === 'education' && cur === 'job - education')) return true;
    if ((target === 'db original' && cur === 'opinion') || (target === 'opinion' && cur === 'db original')) return true;
    if ((target === 'special' && cur === 'khas') || (target === 'khas' && cur === 'special')) return true;

    return false;
  };

  const indianStates = ['Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Delhi', 'Maharashtra', 'Gujarat', 'Punjab', 'Haryana'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-1 sticky top-20">

      {/* Sidebar Navigation Items */}
      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const active = isItemActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group font-bold text-[14px] leading-normal select-none
                ${active
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-extrabold shadow-2xs'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white'
                }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className="truncate flex-1">
                {language === 'Hindi' ? item.nameHi : item.nameEn}
              </span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-orange-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* State & City Quick Selection Popover (if State-City clicked) */}
      {showCityPicker && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 pb-1 border-b dark:border-slate-700">
            <span>{language === 'Hindi' ? 'अपना राज्य चुनें' : 'Select State'}</span>
            <button onClick={() => setShowCityPicker(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
            {indianStates.map((st) => (
              <button
                key={st}
                onClick={() => {
                  navigate(`/?state=${st}`);
                  setShowCityPicker(false);
                }}
                className={`px-2 py-1.5 rounded text-left text-[11px] font-semibold transition-colors
                  ${currentState === st ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;
