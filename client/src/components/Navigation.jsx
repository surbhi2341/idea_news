import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useSelector((state) => state.theme);
  const [activeState, setActiveState] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [activeDistrict, setActiveDistrict] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const categories = [
    { en: 'National', hi: 'राष्ट्रीय' },
    { en: 'International', hi: 'अंतरराष्ट्रीय' },
    { en: 'Politics', hi: 'राजनीति' },
    { en: 'Crime', hi: 'क्राइम' },
    { en: 'Sports', hi: 'खेल' },
    { en: 'Business', hi: 'बिज़नेस' },
    { en: 'Technology', hi: 'टेक' },
    { en: 'Entertainment', hi: 'मनोरंजन' },
    { en: 'Lifestyle', hi: 'लाइफस्टाइल' },
    { en: 'Astrology', hi: 'धर्म-राशि' },
    { en: 'Opinion', hi: 'ओपिनियन' },
    { en: 'Videos', hi: 'वीडियो' },
  ];

  // Hierarchy for State News: State -> Cities -> Districts -> Local News
  const stateHierarchy = {
    'Uttar Pradesh': {
      cities: {
        'Ghaziabad': ['Indirapuram', 'Vasundhara', 'Vaishali'],
        'Noida': ['Sector 62', 'Sector 15', 'Noida Extension'],
        'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Alambagh'],
        'Kanpur': ['Kalyanpur', 'Civil Lines']
      }
    },
    'Madhya Pradesh': {
      cities: {
        'Indore': ['Vijay Nagar', 'Palasia', 'Rajwada'],
        'Bhopal': ['Arera Colony', 'MP Nagar', 'Kolar'],
        'Gwalior': ['Lashkar', 'Morar']
      }
    },
    'Rajasthan': {
      cities: {
        'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme'],
        'Jodhpur': ['Sardarpura', 'Shastri Nagar'],
        'Udaipur': ['Fatehsagar', 'Hiran Magri']
      }
    },
    'Maharashtra': {
      cities: {
        'Mumbai': ['Andheri', 'Bandra', 'Colaba', 'Borivali'],
        'Pune': ['Kothrud', 'Koregaon Park', 'Shivajinagar'],
        'Nagpur': ['Dharampeth', 'Sadashivnagar']
      }
    }
  };

  const handleCategoryClick = (cat) => {
    // Reset state filter if clicking direct categories
    setActiveState('');
    setActiveCity('');
    setActiveDistrict('');
    navigate(`/?category=${cat}`);
  };

  const handleStateSelect = (stateName) => {
    setActiveState(stateName);
    setActiveCity('');
    setActiveDistrict('');
    setShowStateDropdown(false);
    navigate(`/?state=${stateName}`);
  };

  const handleCitySelect = (cityName) => {
    setActiveCity(cityName);
    setActiveDistrict('');
    navigate(`/?state=${activeState}&city=${cityName}`);
  };

  const handleDistrictSelect = (districtName) => {
    setActiveDistrict(districtName);
    navigate(`/?state=${activeState}&city=${activeCity}&district=${districtName}`);
  };

  const selectedCategory = searchParams.get('category');

  return (
    <nav className="bg-slate-900 text-slate-100 dark:bg-slate-950 border-b border-slate-800 text-sm font-semibold">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
        {/* Navigation Categories List */}
        <div className="flex items-center space-x-1 py-1 whitespace-nowrap">
          <button 
            onClick={() => {
              setActiveState('');
              setActiveCity('');
              setActiveDistrict('');
              navigate('/');
            }}
            className={`px-3 py-4 hover:bg-slate-800 transition-colors uppercase tracking-wider font-extrabold ${!selectedCategory && !activeState ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800/40' : ''}`}
          >
            {language === 'Hindi' ? 'होम' : 'Home'}
          </button>
          
          {categories.map((c) => (
            <button 
              key={c.en} 
              onClick={() => handleCategoryClick(c.en)}
              className={`px-3 py-4 hover:bg-slate-800 transition-colors uppercase tracking-wider ${selectedCategory === c.en ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800/40' : ''}`}
            >
              {language === 'Hindi' ? c.hi : c.en}
            </button>
          ))}

          {/* State selector dropdown button */}
          <div className="relative">
            <button 
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              className={`px-3 py-4 hover:bg-slate-800 transition-colors uppercase tracking-wider flex items-center gap-1 text-orange-400 font-extrabold ${activeState ? 'bg-slate-800/40 border-b-2 border-yellow-400' : ''}`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{activeState || (language === 'Hindi' ? 'राज्य चुनें' : 'Select State')}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showStateDropdown && (
              <div className="absolute left-0 mt-1 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-50 w-44">
                {Object.keys(stateHierarchy).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStateSelect(st)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 text-xs transition-colors"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* State secondary local hierarchy toolbar */}
      {activeState && (
        <div className="bg-slate-800/40 border-t border-slate-800 py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap text-[11px] text-slate-350">
            <span className="font-bold text-slate-200 uppercase tracking-widest text-[9px] bg-orange-500 px-1 py-0.5 rounded mr-2">STATE REPORT: {activeState}</span>
            
            {/* Cities selectors */}
            <div className="flex items-center gap-1.5 overflow-visible">
              {Object.keys(stateHierarchy[activeState].cities).map((cty) => (
                <button
                  key={cty}
                  onClick={() => handleCitySelect(cty)}
                  className={`px-2 py-0.5 rounded transition-colors ${activeCity === cty ? 'bg-orange-500 text-slate-950 font-bold' : 'hover:bg-slate-850 hover:text-slate-100'}`}
                >
                  {cty}
                </button>
              ))}
            </div>

            {/* Districts / Local News Selectors */}
            {activeCity && (
              <>
                <span className="text-slate-500">|</span>
                <span className="font-semibold text-slate-300">Local Area:</span>
                <div className="flex items-center gap-1.5 overflow-visible">
                  {stateHierarchy[activeState].cities[activeCity].map((dst) => (
                    <button
                      key={dst}
                      onClick={() => handleDistrictSelect(dst)}
                      className={`px-2 py-4 rounded transition-colors ${activeDistrict === dst ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-850 hover:text-slate-100'}`}
                    >
                      {dst}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav> 
  );
};

export default Navigation;
