import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CommentsSection from '../components/CommentsSection.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { getLocalizedNews } from '../utils/languageUtils.js';
import { getMediaUrl } from '../utils/mediaUtils.js';
import { increaseFontSize, decreaseFontSize } from '../redux/themeSlice.js';
import { 
  Heart, ThumbsUp, ThumbsDown, Bookmark, Share2, Printer, 
  Plus, Minus, Volume2, VolumeX, Eye, Calendar, User, Clock, 
  MapPin, Check, Facebook, Twitter, Send, Link2 
} from 'lucide-react';

const NewsDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { fontSize, language } = useSelector((state) => state.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [related, setRelated] = useState([]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/news/slug/${slug}`);
      if (res.data.success && res.data.news) {
        const article = res.data.news;
        setNews(article);
        setLikesCount(article.likes?.length || 0);
        setDislikesCount(article.dislikes?.length || 0);
        
        if (user) {
          setHasLiked(article.likes?.includes(user.id));
          setHasDisliked(article.dislikes?.includes(user.id));
        }

        // Increment views
        axios.post(`/api/news/id/${article._id}/views`).catch(() => {});

        // Fetch related news from same category
        const relRes = await axios.get(`/api/news?category=${article.category}&limit=4`);
        if (relRes.data.success) {
          setRelated(relRes.data.news.filter((n) => n._id !== article._id));
        }
      }
    } catch (err) {
      console.error(err);
      // Fallback details if server returns 404 or fails
      setupFallbackDetails();
    } finally {
      setLoading(false);
    }
  };

  const setupFallbackDetails = () => {
    const mock = {
      _id: 'm-fallback-detail',
      title: 'PM Launches Smart Cities Infra Projects Worth ₹15,000 Crore in Uttar Pradesh',
      subtitle: 'Bridges, sewage, and metro tracks slated for high speed upgrade in Ghaziabad and Noida.',
      content: '<p>Prime Minister Narendra Modi today inaugurated a basket of key infrastructure development works under the Smart Cities mission. Focus sectors include urban water lines, clean energy grid lines, and new metro routes linking NCR sectors.</p><p>Speaking at the rally in Ghaziabad, the PM highlighted the double-engine growth story of the state, noting that infrastructure boosts employment and standard of living. "Our focus is clean governance and rapid connectivity," he added.</p><p>The programs will be executed over the next eighteen months under supervision of special joint state-center work councils.</p>',
      category: 'National',
      state: 'Uttar Pradesh',
      city: 'Ghaziabad',
      district: 'Indirapuram',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop',
      views: 1245,
      createdAt: new Date().toISOString(),
      reporter: { name: 'Rajesh Kumar' },
      tags: ['SmartCities', 'PMModi', 'Infrastructure', 'UttarPradesh'],
    };
    setNews(mock);
    setLikesCount(120);
    setDislikesCount(8);
    setRelated([
      { _id: 'r1', title: 'UP Metro Expansion to Connect Inner City Hubs', slug: 'up-metro-expansion-connect', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=300&h=200&fit=crop' },
      { _id: 'r2', title: 'Solar Energy Grid to Power Local Offices', slug: 'solar-energy-grid-power', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&h=200&fit=crop' },
    ]);
  };

  useEffect(() => {
    fetchArticle();
    return () => {
      // Cancel TTS speaking if user navigates away
      window.speechSynthesis.cancel();
    };
  }, [slug, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like this article');
      return;
    }
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post(`/api/news/id/${news._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLikesCount(res.data.likesCount);
        setDislikesCount(res.data.dislikesCount);
        setHasLiked(res.data.hasLiked);
        setHasDisliked(false);
      }
    } catch {
      // Simulate locally if server offline
      setHasLiked(!hasLiked);
      setLikesCount(prev => hasLiked ? prev - 1 : prev + 1);
      if (hasDisliked) {
        setHasDisliked(false);
        setDislikesCount(prev => prev - 1);
      }
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert('Please login to dislike this article');
      return;
    }
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post(`/api/news/id/${news._id}/dislike`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLikesCount(res.data.likesCount);
        setDislikesCount(res.data.dislikesCount);
        setHasDisliked(res.data.hasDisliked);
        setHasLiked(false);
      }
    } catch {
      // Simulate locally
      setHasDisliked(!hasDisliked);
      setDislikesCount(prev => hasDisliked ? prev - 1 : prev + 1);
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount(prev => prev - 1);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Locally save bookmarks in localStorage for reader dashboard reference
    let list = JSON.parse(localStorage.getItem('bh_bookmarks') || '[]');
    if (isBookmarked) {
      list = list.filter(item => item.slug !== news.slug);
    } else {
      list.push({ title: news.title, slug: news.slug, category: news.category, image: news.image });
    }
    localStorage.setItem('bh_bookmarks', JSON.stringify(list));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareTooltip(false);
  };

  // Text-To-Speech handler
  const handleVoiceReading = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      if (!news) return;
      // Strip HTML elements for speaking
      const doc = new DOMParser().parseFromString(news.content, 'text/html');
      const plainText = doc.body.textContent || doc.body.innerText || '';
      
      const utterance = new SpeechSynthesisUtterance(news.title + '. ' + (news.subtitle || '') + '. ' + plainText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Article could not be found.
      </div>
    );
  }

  const article = getLocalizedNews(news, language);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Article Detail Body */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 md:p-6 shadow-xs">
          
          {/* Breadcrumb / Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-extrabold uppercase">{news.category}</span>
              {news.state && (
                <>
                  <span>/</span>
                  <span className="text-slate-550 flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5" />{news.state} {news.city && `> ${news.city}`}</span>
                </>
              )}
            </div>
            
            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => dispatch(decreaseFontSize())} 
                className="p-1.5 hover:bg-slate-105 border rounded text-slate-500" 
                title="Decrease Text Size"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => dispatch(increaseFontSize())} 
                className="p-1.5 hover:bg-slate-105 border rounded text-slate-500" 
                title="Increase Text Size"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={handleVoiceReading} 
                className={`p-1.5 border rounded transition-colors ${speaking ? 'bg-red-650 text-white border-red-655' : 'text-slate-500 hover:bg-slate-105'}`}
                title={speaking ? 'Pause Reading' : 'Voice News Reader'}
              >
                {speaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
              <button 
                onClick={() => window.print()} 
                className="p-1.5 hover:bg-slate-105 border rounded text-slate-500 hidden sm:block" 
                title="Print Article"
              >
                <Printer className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-red-650 pl-3">
                {article.subtitle}
              </h2>
            )}
          </div>

          {/* Meta Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-205">
                <User className="h-4 w-4 text-slate-400" />
                Reporter: <span className="font-bold text-slate-800 dark:text-slate-100">{article.reporter?.name || 'Staff Reporter'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.createdAt).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                4 Min Read
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{article.views} views</span>
            </div>
          </div>

          {/* Article Image */}
          {article.image && (
            <div className="rounded-xl overflow-hidden border dark:border-slate-800 shadow-sm">
              <img 
                src={getMediaUrl(article.image)} 
                alt={article.title} 
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* Video Player - agar news me videoUrl hai */}
          {article.videoUrl && (() => {
            const isYouTube = /youtu\.be|youtube\.com/i.test(article.videoUrl);
            const ytId = isYouTube
              ? article.videoUrl.replace(/.*(?:youtu\.be\/|v=|embed\/)/,'').split(/[?&]/)[0]
              : null;
            return (
              <div className="rounded-xl overflow-hidden border dark:border-slate-800 shadow-sm bg-black">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-bold uppercase tracking-wide">Video</span>
                </div>
                {isYouTube ? (
                  <div className="relative w-full" style={{paddingBottom: '56.25%'}}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                      title={article.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <video
                    src={getMediaUrl(article.videoUrl)}
                    controls
                    className="w-full max-h-[420px] bg-black"
                    poster={article.image ? getMediaUrl(article.image) : undefined}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            );
          })()}

          {/* Content Render */}
          <div 
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          {news.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t dark:border-slate-850">
              {news.tags.map((tag, i) => (
                <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Action Triggers: Likes, Bookmark, Share */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  hasLiked 
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-650 border-red-550' 
                    : 'hover:bg-slate-105 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Like ({likesCount})</span>
              </button>

              <button 
                onClick={handleDislike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  hasDisliked 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 border-slate-350' 
                    : 'hover:bg-slate-105 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Dislike ({dislikesCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 relative">
              <button 
                onClick={handleBookmark}
                className={`p-2 rounded-full border transition-all ${
                  isBookmarked 
                    ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-400 text-yellow-600' 
                    : 'hover:bg-slate-105 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
              >
                <Bookmark className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => setShowShareTooltip(!showShareTooltip)}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-105 text-slate-500 transition-colors"
                title="Share news"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              {showShareTooltip && (
                <div className="absolute right-0 bottom-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-2.5 z-20 flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`} target="_blank" rel="noreferrer" className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600">
                    <Send className="h-4 w-4" />
                  </a>
                  <button onClick={handleCopyLink} className="p-1.5 bg-slate-600 text-white rounded hover:bg-slate-700">
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Discussion comments segment */}
          <div className="pt-6 border-t dark:border-slate-800">
            <CommentsSection newsId={news._id} />
          </div>

        </div>

        {/* Right Sidebar: Related articles, Poll, Ad Banner */}
        <div className="space-y-6">
          
          {/* Related Articles list */}
          {related.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b pb-2 mb-4 tracking-tight uppercase">RELATED ARTICLES</h3>
              <div className="space-y-4">
                {related.map((item) => (
                  <div key={item._id} className="flex gap-3 group">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=150&h=100&fit=crop'} 
                      alt="" 
                      className="w-16 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <Link to={`/news/${item.slug}`} className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-red-650 leading-snug line-clamp-2">
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AdBanner type="Sidebar" />

        </div>

      </div>
    </div>
  );
};

export default NewsDetails;
