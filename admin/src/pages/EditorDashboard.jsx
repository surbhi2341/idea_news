import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, ShieldAlert, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

const EditorDashboard = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch Pending News Articles
      const newsRes = await axios.get('/api/news?status=Pending', config);
      if (newsRes.data.success) {
        setPendingNews(newsRes.data.news);
      }

      // Fetch Flagged Reported Comments
      const commRes = await axios.get('/api/comments/pending', config);
      if (commRes.data.success) {
        setReportedComments(commRes.data.comments);
      }
    } catch (err) {
      console.error(err);
      setupMockEditorData();
    } finally {
      setLoading(false);
    }
  };

  const setupMockEditorData = () => {
    setPendingNews([
      {
        _id: 'p1',
        title: 'New Flyover to Ease Traffic Jam in Ghaziabad District',
        category: 'National',
        state: 'Uttar Pradesh',
        city: 'Ghaziabad',
        reporter: { name: 'Rajesh Kumar' },
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'p2',
        title: 'Sports Academy Slated for Rural Youth Coaching Programs',
        category: 'Sports',
        state: 'Madhya Pradesh',
        city: 'Indore',
        reporter: { name: 'Aman Sharma' },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ]);

    setReportedComments([
      {
        _id: 'c1',
        content: 'This news copy is fake propaganda! Down with the editor!',
        guestName: 'Aggressive Reader',
        reportsCount: 4,
        news: { title: 'PM Launches Smart Cities Infra Projects...', slug: 'pm-launches-smart-cities' }
      }
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveNews = async (id, flags = {}) => {
    try {
      const token = localStorage.getItem('bh_token');
      await axios.put(`/api/news/id/${id}`, { status: 'Published', ...flags }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Article Approved & Published!');
      setPendingNews(prev => prev.filter(n => n._id !== id));
    } catch {
      alert('Approved successfully (Simulated)');
      setPendingNews(prev => prev.filter(n => n._id !== id));
    }
  };

  const handleRejectNews = async (id) => {
    try {
      const token = localStorage.getItem('bh_token');
      await axios.delete(`/api/news/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Article Rejected & Moved to Archive!');
      setPendingNews(prev => prev.filter(n => n._id !== id));
    } catch {
      alert('Rejected successfully (Simulated)');
      setPendingNews(prev => prev.filter(n => n._id !== id));
    }
  };

  const handleModerateComment = async (id, status) => {
    try {
      const token = localStorage.getItem('bh_token');
      await axios.post(`/api/comments/id/${id}/moderate`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Comment status updated to: ${status}`);
      setReportedComments(prev => prev.filter(c => c._id !== id));
    } catch {
      alert(`Comment moderated to: ${status} (Simulated)`);
      setReportedComments(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Title Header */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-lg shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase">Editor Board Dashboard</h2>
            <p className="text-xs text-slate-400">Review submitted articles, manage homepage features, and moderate reader comments.</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-450 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-650"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pending Articles Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Pending Approvals ({pendingNews.length})</h3>
                </div>

                {pendingNews.length > 0 ? (
                  <div className="space-y-4">
                    {pendingNews.map((article) => (
                      <div key={article._id} className="border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-semibold">
                        <div className="space-y-1">
                          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">{article.category}</span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{article.title}</h4>
                          <div className="flex items-center gap-4 text-[10px] text-slate-400">
                            <span>Reporter: {article.reporter?.name}</span>
                            {article.state && <span>Location: {article.state} {article.city && `> ${article.city}`}</span>}
                          </div>
                        </div>

                        {/* Editorial action triggers */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                          <button 
                            onClick={() => handleApproveNews(article._id, { breakingNews: true })}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2.5 py-1.5 rounded font-extrabold text-[10px] uppercase shadow-sm"
                            title="Publish as Breaking"
                          >
                            Breaking
                          </button>
                          <button 
                            onClick={() => handleApproveNews(article._id, { editorsPick: true })}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded font-extrabold text-[10px] uppercase shadow-sm"
                            title="Publish as Editors Choice"
                          >
                            Choice
                          </button>
                          <button 
                            onClick={() => handleApproveNews(article._id)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                            title="Standard Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectNews(article._id)}
                            className="bg-red-650 hover:bg-red-700 text-white p-2 rounded-lg"
                            title="Reject/Archive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">Approval queue is empty. Excellent job!</p>
                )}
              </div>
            </div>

            {/* Reported Comments Column */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <MessageCircle className="h-5 w-5 text-red-650" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Reported Comments ({reportedComments.length})</h3>
                </div>

                {reportedComments.length > 0 ? (
                  <div className="space-y-4">
                    {reportedComments.map((comment) => (
                      <div key={comment._id} className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 space-y-2 text-xs font-semibold">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{comment.user?.name || comment.guestName}</span>
                          <span className="text-red-650 font-black bg-red-50 px-1.5 py-0.5 rounded text-[9px]">{comment.reportsCount} Reports</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 italic">"{comment.content}"</p>
                        <div className="text-[10px] text-slate-400 truncate">Story: {comment.news?.title}</div>

                        <div className="flex gap-2 pt-1.5">
                          <button 
                            onClick={() => handleModerateComment(comment._id, 'Approved')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleModerateComment(comment._id, 'Spam')}
                            className="bg-slate-700 hover:bg-slate-850 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors"
                          >
                            Spam
                          </button>
                          <button 
                            onClick={() => handleModerateComment(comment._id, 'Rejected')}
                            className="bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-550 text-center py-6">No reported comments under review.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default EditorDashboard;
