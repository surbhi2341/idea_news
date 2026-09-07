import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutGrid, TrendingUp, RefreshCw, BarChart, ExternalLink, Image } from 'lucide-react';

const AdvertiserDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Banner');
  const [imageUrl, setImageUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.get('/api/ads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCampaigns(res.data.ads);
      }
    } catch {
      setupMockCampaigns();
    } finally {
      setLoading(false);
    }
  };

  const setupMockCampaigns = () => {
    setCampaigns([
      { _id: 'ad1', title: 'Summer Drinks Promotion', type: 'Banner', views: 2420, clicks: 184, advertiser: 'Coca Cola', redirectUrl: 'https://coke.com' },
      { _id: 'ad2', title: 'Premium Apartment Booking', type: 'Sidebar', views: 820, clicks: 42, advertiser: 'DLF Homes', redirectUrl: 'https://dlf.in' },
    ]);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmitAd = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl || !redirectUrl) return;

    try {
      const payload = {
        title,
        advertiser: 'Self Kampaign',
        type,
        imageUrl,
        redirectUrl,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 1000),
      };

      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ads', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('Campaign submitted!');
        setCampaigns(prev => [res.data.ad, ...prev]);
        setTitle('');
        setImageUrl('');
        setRedirectUrl('');
      }
    } catch {
      // Mock submit
      const mockAd = {
        _id: `mock-ad-${Math.random()}`,
        title,
        type,
        views: 0,
        clicks: 0,
        advertiser: 'Self Kampaign',
        redirectUrl,
      };
      setCampaigns(prev => [mockAd, ...prev]);
      setTitle('');
      setImageUrl('');
      setRedirectUrl('');
      alert('Campaign created (Simulated)');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Header bar */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-lg shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase">Advertiser Campaign Panel</h2>
            <p className="text-xs text-slate-400">Launch direct sponsorships, track impressions, and calculate Click-Through-Rates (CTR).</p>
          </div>
          <button 
            onClick={fetchCampaigns}
            className="bg-red-50 dark:bg-red-950/20 text-red-655 p-2 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
          
          {/* Create campaign form */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm border-b pb-2 text-slate-850 dark:text-slate-200 uppercase">New Ad Placement</h3>
            
            <form onSubmit={handleSubmitAd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Festive Sale Banners"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Ad Slot</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800"
                >
                  <option value="Banner">Top Banner (728x90)</option>
                  <option value="Sidebar">Sidebar Box (300x250)</option>
                  <option value="Popup">Interstitial Popup (300x300)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Redirect URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://client-site.com"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-750 text-white font-extrabold text-xs py-2.5 rounded shadow"
              >
                Submit Campaign
              </button>
            </form>
          </div>

          {/* Active Campaigns telemetry list */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm border-b pb-2 text-slate-850 dark:text-slate-205 uppercase">Active Placements Telemetry</h3>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-slate-100 rounded w-full"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <thead>
                    <tr className="border-b dark:border-slate-800 text-slate-400">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5">Placement</th>
                      <th className="py-2.5">Impressions</th>
                      <th className="py-2.5">Clicks</th>
                      <th className="py-2.5">CTR (%)</th>
                      <th className="py-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-850">
                    {campaigns.map((c) => {
                      const ctr = c.views > 0 ? ((c.clicks / c.views) * 100).toFixed(2) : '0.00';
                      return (
                        <tr key={c._id}>
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-100">{c.title}</td>
                          <td className="py-3 text-slate-500">{c.type}</td>
                          <td className="py-3">{c.views}</td>
                          <td className="py-3 text-red-650">{c.clicks}</td>
                          <td className="py-3 font-black text-green-600 dark:text-green-400">{ctr}%</td>
                          <td className="py-3">
                            <a href={c.redirectUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600"><ExternalLink className="h-4 w-4" /></a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-550 text-center py-10">No campaigns launched yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdvertiserDashboard;
