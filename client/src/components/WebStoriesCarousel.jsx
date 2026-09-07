import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const WebStoriesCarousel = () => {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load mock web stories
  useEffect(() => {
    const mockStories = [
      {
        _id: 'ws1',
        title: 'Gold Rates Surge',
        coverImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=150&h=150&fit=crop',
        slides: [
          {
            mediaUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400&h=700&fit=crop',
            heading: 'Gold Touches Record High',
            description: 'Driven by global geopolitical trends, gold reaches ₹74,000 per 10 grams in local bullion market.',
          },
          {
            mediaUrl: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?q=80&w=400&h=700&fit=crop',
            heading: 'Should You Invest Now?',
            description: 'Market analysts suggest systematic investments (SIPs) in gold ETFs rather than heavy physical purchases.',
          },
          {
            mediaUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&h=700&fit=crop',
            heading: 'Future Forecast',
            description: 'Bullion experts anticipate gold may consolidate around the ₹76k mark by the upcoming festive quarter.',
          }
        ]
      },
      {
        _id: 'ws2',
        title: 'New Tech Launch',
        coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&h=150&fit=crop',
        slides: [
          {
            mediaUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400&h=700&fit=crop',
            heading: 'Generative AI at Edge',
            description: 'New smartphones launched with local hardware accelerators running complex LLMs offline.',
          },
          {
            mediaUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&h=700&fit=crop',
            heading: 'Privacy First Focus',
            description: 'Processing voice calls and message summaries directly on your silicon chip, sending 0 data to clouds.',
          }
        ]
      },
      {
        _id: 'ws3',
        title: 'T20 Finals Excitement',
        coverImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=150&h=150&fit=crop',
        slides: [
          {
            mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400&h=700&fit=crop',
            heading: 'Finals Battle Locked',
            description: 'Team India matches up against South Africa for the coveted ICC trophy in Barbados tomorrow.',
          },
          {
            mediaUrl: 'https://images.unsplash.com/photo-1540747737956-37872404a8de?q=80&w=400&h=700&fit=crop',
            heading: 'Key Players to Watch',
            description: 'Kohli and Rohit expected to stabilize the top order, while Bumrah handles early swing duties.',
          }
        ]
      },
      {
        _id: 'ws4',
        title: 'Travel Gems: Spiti',
        coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=150&h=150&fit=crop',
        slides: [
          {
            mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&h=700&fit=crop',
            heading: 'Explore Spiti Valley',
            description: 'A cold desert mountain valley nestled deep in the Himalayas. Your perfect summer getaway.',
          },
          {
            mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&h=700&fit=crop',
            heading: 'Key Tips for Travellers',
            description: 'Acclimatize in Kaza, acquire route permits early, and carry cash as networks can drop.',
          }
        ]
      }
    ];
    setStories(mockStories);
  }, []);

  // Story Auto-Advance Timer
  useEffect(() => {
    if (!activeStory || isPaused) return;

    const timer = setTimeout(() => {
      handleNextSlide();
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeStory, activeSlideIndex, isPaused]);

  const handleOpenStory = (story) => {
    setActiveStory(story);
    setActiveSlideIndex(0);
    setIsPaused(false);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
  };

  const handleNextSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
    } else {
      // Find next story
      const currentIdx = stories.findIndex(s => s._id === activeStory._id);
      if (currentIdx < stories.length - 1) {
        setActiveStory(stories[currentIdx + 1]);
        setActiveSlideIndex(0);
      } else {
        // Last story finished
        handleCloseStory();
      }
    }
  };

  const handlePrevSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    } else {
      // Find previous story
      const currentIdx = stories.findIndex(s => s._id === activeStory._id);
      if (currentIdx > 0) {
        setActiveStory(stories[currentIdx - 1]);
        setActiveSlideIndex(stories[currentIdx - 1].slides.length - 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 my-6">
      <h3 className="text-sm font-bold text-red-600 dark:text-red-500 uppercase mb-3 tracking-wide">WEB STORIES</h3>
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        {stories.map((story) => (
          <button 
            key={story._id} 
            className="flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0 group"
            onClick={() => handleOpenStory(story)}
          >
            <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform duration-300">
              <div className="p-0.5 rounded-full bg-white dark:bg-slate-950">
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-[80px] text-center truncate">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* FULL-SCREEN OVERLAY STORIES PLAYER */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-0 md:p-4">
          <div className="relative w-full max-w-md h-full md:h-[80vh] bg-slate-900 rounded-none md:rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Top Bar with Slide progress Indicators */}
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10">
              <div className="flex gap-1 mb-3">
                {activeStory.slides.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded overflow-hidden">
                    <div 
                      className={`h-full bg-white transition-all duration-[4500ms] ease-linear ${
                        idx < activeSlideIndex ? 'w-full' : idx === activeSlideIndex && !isPaused ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <img src={activeStory.coverImage} alt="" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                  <span className="font-bold text-xs truncate max-w-[180px]">{activeStory.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? <Play className="h-4 w-4 fill-white" /> : <Pause className="h-4 w-4 fill-white" />}
                  </button>
                  <button onClick={handleCloseStory}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Media Area with Click Taps */}
            <div className="relative flex-1 bg-black flex items-center justify-center">
              <img 
                src={activeStory.slides[activeSlideIndex].mediaUrl} 
                alt="" 
                className="w-full h-full object-cover"
              />

              {/* Tap zones for left/right nav */}
              <button 
                onClick={handlePrevSlide} 
                className="absolute left-0 top-0 bottom-0 w-1/4 cursor-w-resize"
              />
              <button 
                onClick={handleNextSlide} 
                className="absolute right-0 top-0 bottom-0 w-1/4 cursor-e-resize"
              />

              {/* Arrow navigation for desktop */}
              <button 
                onClick={handlePrevSlide} 
                className="absolute left-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 hidden md:block"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNextSlide} 
                className="absolute right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 hidden md:block"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Caption Area */}
            <div className="p-5 bg-gradient-to-t from-black via-black/80 to-transparent text-white text-center pb-8">
              <h4 className="font-extrabold text-lg leading-tight mb-2 text-yellow-300">
                {activeStory.slides[activeSlideIndex].heading}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed max-w-sm mx-auto">
                {activeStory.slides[activeSlideIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStoriesCarousel;
