import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Settings, LayoutGrid, Calendar, RefreshCw,
  UserCog, ShieldAlert, BarChart3, Database, KeyRound, BellRing,
  Video as VideoIcon, Newspaper, Trash2, UploadCloud, List,
  Image as ImageIcon, Eye, ExternalLink, Tag, User, Clock, CheckCircle, XCircle, AlertCircle,
  PenSquare, PlusCircle, Bold, Italic, Heading1, Heading2, Quote, Link2, Sparkles, FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Settings forms
  const [siteName, setSiteName] = useState('Bharat News');
  const [contactEmail, setContactEmail] = useState('info@bharatnews.in');
  const [allowGuestComments, setAllowGuestComments] = useState(true);

  // Ad Creator Form
  const [adTitle, setAdTitle] = useState('');
  const [adAdvertiser, setAdAdvertiser] = useState('');
  const [adType, setAdType] = useState('Banner');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adImageFile, setAdImageFile] = useState(null);
  const [adImagePreview, setAdImagePreview] = useState('');
  const [adImageUploading, setAdImageUploading] = useState(false);
  const [adRedirectUrl, setAdRedirectUrl] = useState('');
  const [adStartDate, setAdStartDate] = useState('');
  const [adEndDate, setAdEndDate] = useState('');

  // Video Manager
  const [videosList, setVideosList] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoType, setVideoType] = useState('NewsVideo');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  // E-Paper Manager
  const [epapersList, setEpapersList] = useState([]);
  const [epaperEdition, setEpaperEdition] = useState('');
  const [epaperDate, setEpaperDate] = useState('');
  const [epaperPdfFile, setEpaperPdfFile] = useState(null);
  const [epaperCoverFile, setEpaperCoverFile] = useState(null);
  const [epaperUploading, setEpaperUploading] = useState(false);
  // Breaking News Manager
  const [breakingList, setBreakingList] = useState([]);
  const [breakingTitle, setBreakingTitle] = useState('');
  const [breakingTitleEn, setBreakingTitleEn] = useState('');
  const [breakingLink, setBreakingLink] = useState('');

  // News Manager
  const [newsList, setNewsList] = useState([]);
  const [newsFilter, setNewsFilter] = useState('all'); // all | Published | Draft | Pending | Archived
  const [newsSearch, setNewsSearch] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null); // detail modal

  // Admin News Publisher Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSubtitle, setNewsSubtitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('National');
  const [newsSubcategory, setNewsSubcategory] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsState, setNewsState] = useState('');
  const [newsCity, setNewsCity] = useState('');
  const [newsDistrict, setNewsDistrict] = useState('');
  const [newsTags, setNewsTags] = useState('');
  const [newsImageFile, setNewsImageFile] = useState(null);
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsVideoFile, setNewsVideoFile] = useState(null);
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsIsBreaking, setNewsIsBreaking] = useState(false);
  const [newsIsFeatured, setNewsIsFeatured] = useState(false);
  const [newsIsEditorsPick, setNewsIsEditorsPick] = useState(false);
  const [newsIsPremium, setNewsIsPremium] = useState(false);
  const [newsPublishing, setNewsPublishing] = useState(false);

  const handleInsertNewsTag = (openTag, closeTag) => {
    const textarea = document.getElementById('admin-news-composer-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const replacement = openTag + selection + closeTag;
    setNewsContent(text.substring(0, start) + replacement + text.substring(end));
    textarea.focus();
  };

  const handleAdminCreateNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim() || !newsCategory) {
      return alert('शीर्षक (Title), श्रेणी (Category) और मुख्य सामग्री (Content) भरना अनिवार्य है!');
    }
    try {
      setNewsPublishing(true);
      const token = localStorage.getItem('bh_token');
      const formData = new FormData();
      formData.append('title', newsTitle.trim());
      if (newsSubtitle) formData.append('subtitle', newsSubtitle.trim());
      formData.append('category', newsCategory);
      if (newsSubcategory) formData.append('subcategory', newsSubcategory.trim());
      formData.append('content', newsContent);
      if (newsState) formData.append('state', newsState.trim());
      if (newsCity) formData.append('city', newsCity.trim());
      if (newsDistrict) formData.append('district', newsDistrict.trim());
      if (newsTags) formData.append('tags', newsTags.trim());
      formData.append('breakingNews', newsIsBreaking);
      formData.append('featuredStory', newsIsFeatured);
      formData.append('editorsPick', newsIsEditorsPick);
      formData.append('isPremium', newsIsPremium);

      if (newsImageFile) {
        formData.append('image', newsImageFile);
      } else if (newsImageUrl.trim()) {
        formData.append('image', newsImageUrl.trim());
      }

      if (newsVideoFile) {
        formData.append('video', newsVideoFile);
      } else if (newsVideoUrl.trim()) {
        formData.append('videoUrl', newsVideoUrl.trim());
      }

      const res = await axios.post('/api/news', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert(`समाचार सफलतापूर्ण पब्लिश हो गया! यह अब क्लाइंट साइट के "${newsCategory}" सेक्शन में तुरंत लाइव दिखेगा।`);
        // Reset form
        setNewsTitle('');
        setNewsSubtitle('');
        setNewsContent('');
        setNewsTags('');
        setNewsState('');
        setNewsCity('');
        setNewsDistrict('');
        setNewsSubcategory('');
        setNewsImageFile(null);
        setNewsImageUrl('');
        setNewsVideoFile(null);
        setNewsVideoUrl('');
        setNewsIsBreaking(false);
        setNewsIsFeatured(false);
        setNewsIsEditorsPick(false);
        setNewsIsPremium(false);

        // Fetch refreshed news list and switch to News Manager tab
        fetchNewsList();
        setActiveTab('news');
      }
    } catch (err) {
      console.error('Publish news error:', err);
      alert(err.response?.data?.message || 'समाचार पब्लिश करने में त्रुटि आई');
    } finally {
      setNewsPublishing(false);
    }
  };
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Stats
      const statsRes = await axios.get('/api/admin/stats', config);
      if (statsRes.data.success) setStats(statsRes.data.stats);

      // Users
      const usersRes = await axios.get('/api/admin/users', config);
      if (usersRes.data.success) setUsersList(usersRes.data.users);

      // Settings
      const settingsRes = await axios.get('/api/admin/settings', config);
      if (settingsRes.data.success) {
        const c = settingsRes.data.settings;
        setSiteName(c.siteName || 'Bharat News');
        setContactEmail(c.contactEmail || 'info@bharatnews.in');
        setAllowGuestComments(c.allowGuestComments !== false);
      }

      // Logs
      const logsRes = await axios.get('/api/admin/logs', config);
      if (logsRes.data.success) setAuditLogs(logsRes.data.logs);

      // Videos & E-Papers (public endpoints, no auth needed but harmless to send)
      const videosRes = await axios.get('/api/media/videos');
      if (videosRes.data.success) setVideosList(videosRes.data.videos);

      const epapersRes = await axios.get('/api/epaper');
      if (epapersRes.data.success) setEpapersList(epapersRes.data.epapers);

      const breakingRes = await axios.get('/api/breaking-news', config);
      if (breakingRes.data.success) setBreakingList(breakingRes.data.breakingNews);

      // News list for news manager
      const newsRes = await axios.get('/api/news?limit=100', config);
      if (newsRes.data.success) setNewsList(newsRes.data.news || []);

    } catch (err) {
      console.error(err);
      setupMockAdminData();
    } finally {
      setLoading(false);
    }
  };

  const setupMockAdminData = () => {
    setStats({
      totals: { users: 1420, articles: 480, comments: 2420, views: 98400, revenue: 69580 },
      categoryStats: [
        { _id: 'National', count: 120, views: 32000 },
        { _id: 'Sports', count: 80, views: 24000 },
        { _id: 'Politics', count: 95, views: 18000 },
      ],
      subscriptionStats: [
        { _id: 'Free', count: 1200 },
        { _id: 'Monthly', count: 180 },
        { _id: 'Yearly', count: 40 },
      ]
    });

    setUsersList([
      { _id: 'u1', name: 'Rajesh Kumar', email: 'journalist@bharatnews.in', role: 'Journalist', status: 'Active' },
      { _id: 'u2', name: 'Aman Sharma', email: 'editor@bharatnews.in', role: 'Editor', status: 'Active' },
      { _id: 'u3', name: 'Jane Advertiser', email: 'advertiser@bharatnews.in', role: 'Advertiser', status: 'Active' },
      { _id: 'u4', name: 'Simple Reader', email: 'reader@bharatnews.in', role: 'Reader', status: 'Active' }
    ]);

    setAuditLogs([
      { _id: 'l1', action: 'UPDATE_USER', details: 'Updated role of reader@bharatnews.in to Reader', createdAt: new Date().toISOString() },
      { _id: 'l2', action: 'CREATE_NEWS', details: 'Published news article: pm-launches-smart-cities', createdAt: new Date(Date.now() - 3600000).toISOString() }
    ]);
  };

  const fetchNewsList = async () => {
    setNewsLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/news?limit=100', config);
      if (res.data.success) setNewsList(res.data.news || []);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeleteNews = async (id, title) => {
    if (!confirm(`"${title}" ko delete karna chahte hain?`)) return;
    try {
      const token = localStorage.getItem('bh_token');
      await axios.delete(`/api/news/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewsList(prev => prev.filter(n => n._id !== id));
      alert('News delete ho gayi!');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete fail ho gaya');
    }
  };

  const handleCreateBreakingNews = async (e) => {
    e.preventDefault();
    if (!breakingTitle) return alert('Title zaroori hai');
    try {
      const token = localStorage.getItem('bh_token');
      const payload = {
        title: breakingTitle,
        titleEn: breakingTitleEn,
        link: breakingLink
      };
      const res = await axios.post('/api/breaking-news', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBreakingList(prev => [res.data.breakingNews, ...prev]);
        setBreakingTitle('');
        setBreakingTitleEn('');
        setBreakingLink('');
        alert('Breaking news publish ho gayi!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submit fail ho gaya');
    }
  };

  const handleToggleBreakingStatus = async (id) => {
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.put(`/api/breaking-news/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBreakingList(prev => prev.map(item => item._id === id ? { ...item, isActive: !item.isActive } : item));
        alert('Breaking News Status Toggle Ho Gaya!');
      }
    } catch (err) {
      alert('Status change fail ho gaya');
    }
  };

  const handleDeleteBreakingNews = async (id) => {
    if (!confirm('Ye breaking news item delete karna hai?')) return;
    try {
      const token = localStorage.getItem('bh_token');
      await axios.delete(`/api/breaking-news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBreakingList(prev => prev.filter(item => item._id !== id));
      alert('Breaking news delete ho gayi!');
    } catch (err) {
      alert('Delete fail ho gaya');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('User role updated!');
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch {
      alert(`Updated to role: ${newRole} (Simulated)`);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.put(`/api/admin/users/${userId}/role`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('User status updated!');
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      }
    } catch {
      alert(`Updated user status: ${newStatus} (Simulated)`);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('bh_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('/api/admin/settings', { key: 'siteName', value: siteName }, config);
      await axios.put('/api/admin/settings', { key: 'contactEmail', value: contactEmail }, config);
      await axios.put('/api/admin/settings', { key: 'allowGuestComments', value: allowGuestComments }, config);
      alert('System settings updated successfully!');
    } catch {
      alert('Settings updated (Simulated)');
    }
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();
    if (!adTitle || (!adImageUrl && !adImageFile) || !adRedirectUrl) return alert('Campaign Title, Image aur Destination Link zaroori hain!');
    try {
      setAdImageUploading(true);
      let finalImageUrl = adImageUrl;
      if (adImageFile) {
        const formData = new FormData();
        formData.append('image', adImageFile);
        const token = localStorage.getItem('bh_token');
        const uploadRes = await axios.post('/api/ads/upload-image', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          finalImageUrl = uploadRes.data.url;
        } else {
          setAdImageUploading(false);
          return alert('Image upload fail ho gaya!');
        }
      }

      const token = localStorage.getItem('bh_token');
      const payload = {
        title: adTitle,
        advertiser: adAdvertiser || 'Direct client',
        type: adType,
        imageUrl: finalImageUrl,
        redirectUrl: adRedirectUrl,
        startDate: adStartDate ? new Date(adStartDate) : new Date(),
        endDate: adEndDate ? new Date(adEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await axios.post('/api/ads', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Advertisement Campaign created and active!');
      setAdTitle('');
      setAdAdvertiser('');
      setAdImageUrl('');
      setAdImageFile(null);
      setAdImagePreview('');
      setAdRedirectUrl('');
      setAdStartDate('');
      setAdEndDate('');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Ad campaign created (Simulated)');
      setAdTitle('');
      setAdImageUrl('');
      setAdImageFile(null);
      setAdImagePreview('');
      setAdRedirectUrl('');
    } finally {
      setAdImageUploading(false);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle || !videoFile) return alert('Title aur video file dono zaroori hain');
    try {
      setVideoUploading(true);
      const token = localStorage.getItem('bh_token');
      const formData = new FormData();
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('type', videoType);
      formData.append('video', videoFile);

      const res = await axios.post('/api/media/videos', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setVideosList((prev) => [res.data.video, ...prev]);
        setVideoTitle('');
        setVideoDescription('');
        setVideoFile(null);
        alert('Video upload ho gaya!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Video upload fail ho gaya');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm('Ye video delete karna hai?')) return;
    try {
      const token = localStorage.getItem('bh_token');
      await axios.delete(`/api/media/videos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setVideosList((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert('Delete fail ho gaya');
    }
  };

  const handleUploadEPaper = async (e) => {
    e.preventDefault();
    if (!epaperEdition || !epaperPdfFile) return alert('Edition naam aur PDF file dono zaroori hain');
    try {
      setEpaperUploading(true);
      const token = localStorage.getItem('bh_token');
      const formData = new FormData();
      formData.append('edition', epaperEdition);
      if (epaperDate) formData.append('date', epaperDate);
      formData.append('pdf', epaperPdfFile);
      if (epaperCoverFile) formData.append('coverImage', epaperCoverFile);

      const res = await axios.post('/api/epaper', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEpapersList((prev) => [res.data.epaper, ...prev]);
        setEpaperEdition('');
        setEpaperDate('');
        setEpaperPdfFile(null);
        setEpaperCoverFile(null);
        alert('E-Paper upload ho gaya!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'E-Paper upload fail ho gaya');
    } finally {
      setEpaperUploading(false);
    }
  };

  const handleDeleteEPaper = async (id) => {
    if (!confirm('Ye e-paper issue delete karna hai?')) return;
    try {
      const token = localStorage.getItem('bh_token');
      await axios.delete(`/api/epaper/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEpapersList((prev) => prev.filter((ep) => ep._id !== id));
    } catch {
      alert('Delete fail ho gaya');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-lg shadow-sm gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase">Platform Control Center</h2>
            <p className="text-xs text-slate-400">Manage site settings, user roles, direct campaigns, and view telemetry metrics.</p>
          </div>
          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3.5 py-2 rounded shadow transition-all self-end sm:self-auto"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>Sync DB Settings</span>
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b dark:border-slate-800 gap-1 overflow-x-auto no-scrollbar font-bold text-xs select-none">
          <button onClick={() => setActiveTab('stats')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'stats' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><BarChart3 className="h-4 w-4" />Metrics</button>
          <button onClick={() => setActiveTab('breaking')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'breaking' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><BellRing className="h-4 w-4 text-red-600" />Breaking News</button>
          <button onClick={() => setActiveTab('publishNews')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'publishNews' ? 'border-red-600 text-red-605 font-black' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><PenSquare className="h-4 w-4 text-red-600" />Write News</button>
          <button onClick={() => { setActiveTab('news'); fetchNewsList(); }} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'news' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><List className="h-4 w-4" />News Manager</button>
          <button onClick={() => setActiveTab('users')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'users' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><UserCog className="h-4 w-4" />Roles Manager</button>
          <button onClick={() => setActiveTab('ads')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'ads' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><LayoutGrid className="h-4 w-4" />Ads Manager</button>
          <button onClick={() => setActiveTab('videos')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'videos' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><VideoIcon className="h-4 w-4" />Video Manager</button>
          <button onClick={() => setActiveTab('epaper')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'epaper' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><Newspaper className="h-4 w-4" />E-Paper Manager</button>
          <button onClick={() => setActiveTab('settings')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'settings' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><Settings className="h-4 w-4" />Site Config</button>
          <button onClick={() => setActiveTab('logs')} className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'logs' ? 'border-red-600 text-red-605' : 'border-transparent text-slate-450 hover:text-slate-700'}`}><ShieldAlert className="h-4 w-4" />Audit Trail</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-650"></div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Breaking News Tab */}
            {activeTab === 'breaking' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <BellRing className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Add Live Breaking News</h3>
                  </div>
                  <form onSubmit={handleCreateBreakingNews} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Title (Hindi)</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. बड़ी खबर: सोने की कीमत में भारी गिरावट"
                          value={breakingTitle}
                          onChange={(e) => setBreakingTitle(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Title (English - Optional)</label>
                        <input
                          type="text"
                          placeholder="E.g. Breaking: Gold prices drop significantly"
                          value={breakingTitleEn}
                          onChange={(e) => setBreakingTitleEn(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Target Link (Optional - opens when user clicks ticker)</label>
                      <input
                        type="text"
                        placeholder="E.g. /#/news/gold-rates-update"
                        value={breakingLink}
                        onChange={(e) => setBreakingLink(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow transition-colors"
                    >
                      Publish Breaking News
                    </button>
                  </form>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase border-b pb-2">Active Ticker Items ({breakingList.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <thead>
                        <tr className="border-b dark:border-slate-800 text-slate-400 text-left">
                          <th className="py-2.5">Title (Hindi)</th>
                          <th className="py-2.5">Title (English)</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-850">
                        {breakingList.map((item) => (
                          <tr key={item._id}>
                            <td className="py-3 max-w-xs truncate">{item.title}</td>
                            <td className="py-3 max-w-xs truncate text-slate-400">{item.titleEn || '-'}</td>
                            <td className="py-3">
                              <button
                                onClick={() => handleToggleBreakingStatus(item._id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${item.isActive
                                    ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                  }`}
                              >
                                {item.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteBreakingNews(item._id)}
                                className="text-red-650 hover:text-red-700 font-bold"
                              >
                                <Trash2 className="h-4 w-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {breakingList.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-4 text-center text-slate-400">No breaking news items found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
              <div className="space-y-6">
                {/* Total Grid Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">TOTAL USERS</span>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totals.users}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ARTICLES</span>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totals.articles}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">COMMENTS</span>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totals.comments}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">NEWS VIEWS</span>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totals.views}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm text-center col-span-2 md:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">REVENUE EST</span>
                    <span className="text-xl md:text-2xl font-black text-green-600 dark:text-green-400">₹{stats.totals.revenue}</span>
                  </div>
                </div>

                {/* Section grids breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                  {/* Views breakdown by section */}
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-lg shadow-sm">
                    <h3 className="font-extrabold text-sm border-b pb-2 mb-3 text-slate-800 dark:text-slate-200 uppercase">Category Distribution</h3>
                    <div className="space-y-3">
                      {stats.categoryStats?.map((c, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-650 dark:text-slate-350">
                          <span>{c._id}</span>
                          <span>{c.count} stories ({c.views} views)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscriptions tier stats */}
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-lg shadow-sm">
                    <h3 className="font-extrabold text-sm border-b pb-2 mb-3 text-slate-800 dark:text-slate-200 uppercase">Subscription Analytics</h3>
                    <div className="space-y-3">
                      {stats.subscriptionStats?.map((s, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-655 dark:text-slate-350">
                          <span>{s._id} Tier Members</span>
                          <span className="font-black text-slate-850 dark:text-slate-100">{s.count} Users</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ PUBLISH NEWS (WRITE NEWS) TAB ═══════════════ */}
            {activeTab === 'publishNews' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <PenSquare className="h-5 w-5 text-red-600" />
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">
                          नया समाचार लिखें और पब्लिश करें (Publish Article)
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          यहाँ डाला गया समाचार तुरंत लाइव हो जाएगा और क्लाइंट साइट के संबंधित साइडबार सेक्शन में दिखेगा।
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('news')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      वापस न्यूज़ लिस्ट पर जाएँ ›
                    </button>
                  </div>

                  <form onSubmit={handleAdminCreateNews} className="space-y-5 text-xs font-semibold">
                    {/* Title */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-500 uppercase font-black">
                          समाचार मुख्य शीर्षक (Article Title) *
                        </label>
                        <span className="text-[10px] text-slate-400">{newsTitle.length}/180 अक्षर</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="उदा. बड़ी खबर: भारत-श्रीलंका टेस्ट मैच में भारतीय बल्लेबाजों का शानदार प्रदर्शन..."
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full text-sm font-bold p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">
                        उपशीर्षक / मुख्य सारांश (Subtitle / Hook)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. कोलंबो टेस्ट में पहली पारी में 500 से अधिक रनों का स्कोर खड़ा किया..."
                        value={newsSubtitle}
                        onChange={(e) => setNewsSubtitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Category Selection Grid - Corresponds to Sidebar Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-red-600 uppercase font-black flex items-center gap-1">
                          <Tag className="w-3 h-3" /> साइडबार श्रेणी (Sidebar Category) *
                        </label>
                        <select
                          value={newsCategory}
                          onChange={(e) => setNewsCategory(e.target.value)}
                          className="w-full text-xs font-bold p-2.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/20 text-slate-900 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="National">National (टॉप न्यूज़)</option>
                          <option value="Cricket">Cricket (क्रिकेट)</option>
                          <option value="Bollywood">Bollywood (बॉलीवुड)</option>
                          <option value="Politics">Politics (राजनीति)</option>
                          <option value="Business">Business (बिजनेस)</option>
                          <option value="Job - Education">Job - Education (जॉब - एजुकेशन)</option>
                          <option value="Lifestyle">Lifestyle (लाइफस्टाइल)</option>
                          <option value="Jeevan Mantra">Jeevan Mantra (जीवन मंत्र)</option>
                          <option value="Technology">Technology (टेक)</option>
                          <option value="World">World (देश-विदेश)</option>
                          <option value="Investigation">Investigation (इन्वेस्टिगेशन)</option>
                          <option value="Special">Special (खास)</option>
                          <option value="DB Original">DB Original (DB ओरिजिनल)</option>
                          <option value="Sports">Sports (स्पोर्ट्स)</option>
                          <option value="Crime">Crime (क्राइम)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">
                          उप-श्रेणी (Subcategory - Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. T20, Box Office, Stock Market"
                          value={newsSubcategory}
                          onChange={(e) => setNewsSubcategory(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">
                          टैग्स (Tags - अल्पविराम से अलग करें)
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. India, Cricket, Series, Test"
                          value={newsTags}
                          onChange={(e) => setNewsTags(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Regional Targeting (Optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-black">राज्य (State - Optional)</label>
                        <input
                          type="text"
                          placeholder="उदा. Uttar Pradesh, Delhi, Bihar"
                          value={newsState}
                          onChange={(e) => setNewsState(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-black">शहर (City - Optional)</label>
                        <input
                          type="text"
                          placeholder="उदा. Lucknow, Patna, Jaipur"
                          value={newsCity}
                          onChange={(e) => setNewsCity(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-black">जिला/इलाका (District - Optional)</label>
                        <input
                          type="text"
                          placeholder="उदा. Gomti Nagar, Civil Lines"
                          value={newsDistrict}
                          onChange={(e) => setNewsDistrict(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Media Attachments: Image & Video */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                      {/* Image Upload / URL */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> कवर इमेज (Cover Image)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setNewsImageFile(file);
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2.5 file:py-1 file:rounded"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">या URL:</span>
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/..."
                              value={newsImageUrl}
                              onChange={(e) => setNewsImageUrl(e.target.value)}
                              className="flex-1 text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          {(newsImageFile || newsImageUrl) && (
                            <div className="mt-2 h-28 rounded-lg overflow-hidden border dark:border-slate-700 bg-black flex items-center justify-center">
                              <img
                                src={newsImageFile ? URL.createObjectURL(newsImageFile) : newsImageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Upload / URL */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                          <VideoIcon className="w-3.5 h-3.5 text-red-500" /> वीडियो अटैचमेंट (Video - Optional)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setNewsVideoFile(e.target.files?.[0] || null)}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-slate-800 file:text-white file:px-2.5 file:py-1 file:rounded"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">या YouTube/MP4:</span>
                            <input
                              type="text"
                              placeholder="https://youtube.com/watch?v=..."
                              value={newsVideoUrl}
                              onChange={(e) => setNewsVideoUrl(e.target.value)}
                              className="flex-1 text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          {newsVideoUrl && (
                            <p className="text-[10px] text-green-600 truncate font-semibold">
                              Attached Video: {newsVideoUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Textarea with Formatting Toolbar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-500 uppercase font-black">
                          विस्तृत समाचार सामग्री (Article Body / Content) *
                        </label>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
                          <button type="button" onClick={() => handleInsertNewsTag('<b>', '</b>')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[10px] font-bold" title="Bold"><Bold className="w-3 h-3" /></button>
                          <button type="button" onClick={() => handleInsertNewsTag('<i>', '</i>')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[10px]" title="Italic"><Italic className="w-3 h-3" /></button>
                          <button type="button" onClick={() => handleInsertNewsTag('<h3>', '</h3>')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[10px]" title="Heading"><Heading2 className="w-3 h-3" /></button>
                          <button type="button" onClick={() => handleInsertNewsTag('<blockquote>', '</blockquote>')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[10px]" title="Quote"><Quote className="w-3 h-3" /></button>
                          <button type="button" onClick={() => handleInsertNewsTag('<p>', '</p>')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[10px] font-bold" title="Paragraph">¶</button>
                        </div>
                      </div>
                      <textarea
                        id="admin-news-composer-textarea"
                        rows="7"
                        required
                        placeholder="यहाँ पूरा समाचार विस्तार से लिखें..."
                        value={newsContent}
                        onChange={(e) => setNewsContent(e.target.value)}
                        className="w-full text-xs leading-relaxed p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Article Priority Badges */}
                    <div className="flex flex-wrap items-center gap-4 py-2 border-y dark:border-slate-800">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newsIsBreaking}
                          onChange={(e) => setNewsIsBreaking(e.target.checked)}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-red-600">🚨 ब्रेकिंग न्यूज़ (Breaking News)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newsIsFeatured}
                          onChange={(e) => setNewsIsFeatured(e.target.checked)}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-amber-600">⭐ फीचर्ड मुख्य खबर (Hero Story)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newsIsEditorsPick}
                          onChange={(e) => setNewsIsEditorsPick(e.target.checked)}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-blue-600">✨ खास रिपोर्ट (Editor's Pick)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newsIsPremium}
                          onChange={(e) => setNewsIsPremium(e.target.checked)}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-purple-600">👑 प्रीमियम (Premium)</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={newsPublishing}
                        className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-8 py-3 rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <UploadCloud className="h-4 w-4" />
                        {newsPublishing ? 'पब्लिश हो रहा है...' : 'समाचार तुरंत लाइव पब्लिश करें'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('news')}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-lg transition-colors"
                      >
                        कैंसल करें
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ═══════════════ NEWS MANAGER TAB ═══════════════ */}
            {activeTab === 'news' && (
              <div className="space-y-5">

                {/* ── Full-Screen Detail Modal ── */}
                {selectedArticle && (() => {
                  const art = selectedArticle;
                  const isYouTube = art.videoUrl && /youtu\.be|youtube\.com/i.test(art.videoUrl);
                  const ytId = isYouTube
                    ? art.videoUrl.replace(/.*(?:youtu\.be\/|v=|embed\/)/, '').split(/[?&]/)[0]
                    : null;

                  return (
                    <div
                      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6 px-3"
                      onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded uppercase">{art.category}</span>
                            {art.status && (
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${art.status === 'Published' ? 'bg-green-100 text-green-700' :
                                  art.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    art.status === 'Draft' ? 'bg-slate-100 text-slate-500' :
                                      'bg-red-100 text-red-600'
                                }`}>{art.status}</span>
                            )}
                            {art.breakingNews && (
                              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">BREAKING</span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedArticle(null)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-400 transition-colors text-lg font-black"
                          >
                            ×
                          </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-5">

                          {/* Title + Subtitle */}
                          <div className="space-y-2">
                            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">{art.title}</h2>
                            {art.subtitle && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 border-l-2 border-red-500 pl-3 leading-relaxed">{art.subtitle}</p>
                            )}
                          </div>

                          {/* Meta strip */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400 font-semibold py-3 border-y dark:border-slate-800">
                            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <User className="h-3.5 w-3.5" />{art.reporter?.name || 'Staff Reporter'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />{new Date(art.createdAt).toLocaleString('hi-IN')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5" />{art.views || 0} views
                            </span>
                            {art.state && <span className="text-slate-500">{art.state}{art.city ? ` › ${art.city}` : ''}</span>}
                          </div>

                          {/* Cover Image */}
                          {art.image && (
                            <div className="rounded-xl overflow-hidden border dark:border-slate-800">
                              <img
                                src={art.image}
                                alt={art.title}
                                className="w-full max-h-[380px] object-cover"
                              />
                            </div>
                          )}

                          {/* Video Player */}
                          {art.videoUrl && (
                            <div className="rounded-xl overflow-hidden border dark:border-slate-800 bg-black">
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-700">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-white text-xs font-bold uppercase tracking-wide">Video</span>
                                <span className="text-slate-400 text-[10px] ml-auto truncate max-w-xs">{art.videoUrl}</span>
                              </div>
                              {isYouTube ? (
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                  <iframe
                                    src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                                    title={art.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full border-0"
                                  />
                                </div>
                              ) : (
                                <video
                                  src={art.videoUrl}
                                  controls
                                  className="w-full max-h-[380px] bg-black"
                                  poster={art.image || undefined}
                                >
                                  Your browser does not support video.
                                </video>
                              )}
                            </div>
                          )}

                          {/* Article Content */}
                          {art.content && (
                            <div
                              className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: art.content }}
                            />
                          )}

                          {/* Tags */}
                          {art.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t dark:border-slate-800">
                              {art.tags.map((tag, ti) => (
                                <span key={ti} className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">#{tag}</span>
                              ))}
                            </div>
                          )}

                          {/* Modal Footer Actions */}
                          <div className="flex gap-3 pt-2 border-t dark:border-slate-800">
                            <a
                              href={`http://localhost:5173/#/news/${art.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Client Site Par Dekho
                            </a>
                            <button
                              onClick={() => { handleDeleteNews(art._id, art.title); setSelectedArticle(null); }}
                              className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                            <button
                              onClick={() => setSelectedArticle(null)}
                              className="ml-auto flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                              Band Karo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Header + Filters */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-red-600" />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">All Published &amp; Pending News</h3>
                      <span className="ml-2 bg-red-50 dark:bg-red-950/30 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{newsList.length} articles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('publishNews')}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        + नया समाचार पब्लिश करें
                      </button>
                      <button
                        onClick={fetchNewsList}
                        className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Search + Status Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Title ya category se search karein..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-red-400"
                    />
                    <select
                      value={newsFilter}
                      onChange={(e) => setNewsFilter(e.target.value)}
                      className="text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      <option value="all">All Status</option>
                      <option value="Published">Published</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* News Grid */}
                {newsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
                  </div>
                ) : newsList.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-12 text-center">
                    <List className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">Backend se koi news nahi aayi abhi tak.</p>
                    <p className="text-slate-400 text-xs mt-1">Journalist ya Editor se news publish karwaiye.</p>
                  </div>
                ) : (() => {
                  const filtered = newsList.filter(n => {
                    const matchStatus = newsFilter === 'all' || n.status === newsFilter;
                    const matchSearch = !newsSearch ||
                      n.title?.toLowerCase().includes(newsSearch.toLowerCase()) ||
                      n.category?.toLowerCase().includes(newsSearch.toLowerCase());
                    return matchStatus && matchSearch;
                  });

                  return filtered.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-12 text-center">
                      <p className="text-slate-400 text-sm font-semibold">Is filter mein koi news nahi mili.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((article) => {
                        const hasVideo = !!article.videoUrl;
                        const hasImage = !!article.image;
                        const statusColors = {
                          Published: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
                          Pending: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
                          Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
                          Archived: 'bg-red-100 dark:bg-red-950/20 text-red-600',
                        };
                        const StatusIcon = {
                          Published: CheckCircle,
                          Pending: AlertCircle,
                          Draft: Clock,
                          Archived: XCircle
                        }[article.status] || Clock;

                        return (
                          <div key={article._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">

                            {/* Thumbnail */}
                            <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              {hasImage ? (
                                <img
                                  src={article.image}
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                                  <ImageIcon className="h-10 w-10 text-slate-300" />
                                  <span className="text-[10px] text-slate-400">No Image</span>
                                </div>
                              )}

                              {/* Media type badges */}
                              <div className="absolute top-2 left-2 flex gap-1.5">
                                {hasImage && (
                                  <span className="bg-blue-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <ImageIcon className="h-2.5 w-2.5" /> IMAGE
                                  </span>
                                )}
                                {hasVideo && (
                                  <span className="bg-red-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <VideoIcon className="h-2.5 w-2.5" /> VIDEO
                                  </span>
                                )}
                              </div>

                              {/* Category badge */}
                              <div className="absolute top-2 right-2">
                                <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded">{article.category}</span>
                              </div>

                              {/* Video play overlay */}
                              {hasVideo && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/50">
                                    <VideoIcon className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="p-3.5 flex flex-col flex-1 space-y-2.5">

                              {/* Status badge + breaking */}
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${statusColors[article.status] || statusColors.Draft}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {article.status}
                                </span>
                                {article.breakingNews && (
                                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">BREAKING</span>
                                )}
                              </div>

                              {/* Title */}
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">{article.title}</p>

                              {/* Meta */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-semibold">
                                <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.reporter?.name || 'Staff'}</span>
                                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views || 0} views</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(article.createdAt).toLocaleDateString('hi-IN')}</span>
                              </div>

                              {/* Tags */}
                              {article.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {article.tags.slice(0, 3).map((tag, ti) => (
                                    <span key={ti} className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded">#{tag}</span>
                                  ))}
                                </div>
                              )}

                              {/* Action buttons */}
                              <div className="pt-2 border-t dark:border-slate-800 flex items-center gap-2 mt-auto">
                                {/* Detail Dekho - opens modal */}
                                <button
                                  onClick={() => setSelectedArticle(article)}
                                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black py-1.5 rounded-lg transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Detail Dekho
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteNews(article._id, article.title)}
                                  className="flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Registered Accounts</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <thead>
                      <tr className="border-b dark:border-slate-800 text-slate-400 text-left">
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Platform Role</th>
                        <th className="py-2.5">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-850">
                      {usersList.map((usr) => (
                        <tr key={usr._id}>
                          <td className="py-3">{usr.name}</td>
                          <td className="py-3 text-slate-500">{usr.email || usr.phone}</td>
                          <td className="py-3">
                            <select
                              value={usr.role}
                              onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                              className="bg-slate-50 dark:bg-slate-800 border p-1 rounded font-bold"
                            >
                              <option value="Reader">Reader</option>
                              <option value="Journalist">Journalist</option>
                              <option value="Editor">Editor</option>
                              <option value="Advertiser">Advertiser</option>
                              <option value="Admin">Admin</option>
                              <option value="Super Admin">Super Admin</option>
                            </select>
                          </td>
                          <td className="py-3">
                            <select
                              value={usr.status || 'Active'}
                              onChange={(e) => handleStatusChange(usr._id, e.target.value)}
                              className="bg-slate-50 dark:bg-slate-800 border p-1 rounded font-bold"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ads Manager Tab */}
            {activeTab === 'ads' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <LayoutGrid className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Create Direct Campaign</h3>
                </div>

                <form onSubmit={handleCreateAd} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Campaign Title</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Discount Sale 2026"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Advertiser Brand</label>
                      <input
                        type="text"
                        placeholder="E.g. Samsung India"
                        value={adAdvertiser}
                        onChange={(e) => setAdAdvertiser(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black">Ad Slot Type</label>
                      <select
                        value={adType}
                        onChange={(e) => setAdType(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      >
                        <option value="Banner">Top Banner (728x90)</option>
                        <option value="Sidebar">Sidebar Block (300x250)</option>
                        <option value="Popup">Interstitial Popup (300x300)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black">Banner Image Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        required={!adImageUrl}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setAdImageFile(file);
                          if (file) setAdImagePreview(URL.createObjectURL(file));
                          else setAdImagePreview('');
                        }}
                        className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-xs file:font-bold file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2.5 file:py-1 file:rounded"
                      />
                      {adImagePreview && (
                        <div className="mt-2 p-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <img src={adImagePreview} alt="Ad Preview" className="max-h-28 w-auto object-contain rounded" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black">Destination Link (Redirect)</label>
                      <input
                        type="text"
                        required
                        placeholder="https://brand-website.com"
                        value={adRedirectUrl}
                        onChange={(e) => setAdRedirectUrl(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Campaign Start</label>
                      <input
                        type="date"
                        value={adStartDate}
                        onChange={(e) => setAdStartDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Campaign End</label>
                      <input
                        type="date"
                        value={adEndDate}
                        onChange={(e) => setAdEndDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow transition-colors"
                  >
                    Deploy Campaign
                  </button>
                </form>
              </div>
            )}

            {/* Video Manager Tab */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <VideoIcon className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Upload New Video</h3>
                  </div>
                  <form onSubmit={handleUploadVideo} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Video Title</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. PM addresses the nation"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Video Type</label>
                        <select
                          value={videoType}
                          onChange={(e) => setVideoType(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        >
                          <option value="NewsVideo">News Video</option>
                          <option value="ShortVideo">Short Video</option>
                          <option value="LiveTV">Live TV</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Description (optional)</label>
                      <textarea
                        rows="2"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Video File (mp4/webm)</label>
                      <input
                        type="file"
                        accept="video/*"
                        required
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2 file:py-1 file:rounded"
                      />
                      {videoFile && <p className="text-[10px] text-slate-400 truncate">{videoFile.name}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={videoUploading}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <UploadCloud className="h-4 w-4" />{videoUploading ? 'Uploading...' : 'Upload Video'}
                    </button>
                  </form>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase border-b pb-2">Published Videos ({videosList.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
                    {videosList.map((v) => (
                      <div key={v._id} className="border dark:border-slate-800 rounded-lg overflow-hidden">
                        <video src={v.url} className="w-full aspect-video bg-black object-cover" muted />
                        <div className="p-2.5 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{v.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{v.type}</p>
                          </div>
                          <button onClick={() => handleDeleteVideo(v._id)} className="text-red-600 hover:text-red-700 shrink-0"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                    {videosList.length === 0 && <p className="text-slate-400 text-xs">Koi video upload nahi hui abhi tak.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* E-Paper Manager Tab */}
            {activeTab === 'epaper' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Newspaper className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Upload New E-Paper Issue</h3>
                  </div>
                  <form onSubmit={handleUploadEPaper} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Edition Name</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. National Edition"
                          value={epaperEdition}
                          onChange={(e) => setEpaperEdition(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Publish Date</label>
                        <input
                          type="date"
                          value={epaperDate}
                          onChange={(e) => setEpaperDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">PDF File</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          required
                          onChange={(e) => setEpaperPdfFile(e.target.files?.[0] || null)}
                          className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2 file:py-1 file:rounded"
                        />
                        {epaperPdfFile && <p className="text-[10px] text-slate-400 truncate">{epaperPdfFile.name}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Cover Image (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEpaperCoverFile(e.target.files?.[0] || null)}
                          className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2 file:py-1 file:rounded"
                        />
                        {epaperCoverFile && <p className="text-[10px] text-slate-400 truncate">{epaperCoverFile.name}</p>}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={epaperUploading}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <UploadCloud className="h-4 w-4" />{epaperUploading ? 'Uploading...' : 'Upload E-Paper'}
                    </button>
                  </form>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase border-b pb-2">Published Issues ({epapersList.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
                    {epapersList.map((ep) => (
                      <div key={ep._id} className="border dark:border-slate-800 rounded-lg overflow-hidden p-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{ep.edition}</p>
                          <p className="text-[10px] text-slate-400">{new Date(ep.date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteEPaper(ep._id)} className="text-red-600 hover:text-red-700 shrink-0"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                    {epapersList.length === 0 && <p className="text-slate-400 text-xs">Koi e-paper issue upload nahi hui abhi tak.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Site Config settings */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Settings className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Global Site Configurations</h3>
                </div>

                <form onSubmit={handleUpdateSettings} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-505 uppercase font-black">Site Title</label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-505 uppercase font-black">Support Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="guestComments"
                      checked={allowGuestComments}
                      onChange={(e) => setAllowGuestComments(e.target.checked)}
                      className="h-4 w-4 text-red-600 rounded"
                    />
                    <label htmlFor="guestComments" className="text-xs text-slate-655 dark:text-slate-300 font-bold select-none cursor-pointer">
                      Allow Unauthenticated Guest Comments
                    </label>
                  </div>

                  <div className="pt-2 border-t flex gap-2">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow"
                    >
                      Save Configuration
                    </button>
                    <button
                      type="button"
                      className="bg-slate-800 text-white font-extrabold text-xs px-6 py-2.5 rounded hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                    >
                      <Database className="h-4 w-4" />
                      <span>Trigger Cold DB Backup</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Audit Logs tab */}
            {activeTab === 'logs' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Audit Security Feed</h3>
                </div>

                <div className="space-y-3 font-semibold text-xs">
                  {auditLogs.map((log) => (
                    <div key={log._id} className="border-b dark:border-slate-800 pb-2.5 flex justify-between gap-4">
                      <div>
                        <span className="font-black text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded text-[9px] uppercase mr-2">{log.action}</span>
                        <span className="text-slate-700 dark:text-slate-200">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
