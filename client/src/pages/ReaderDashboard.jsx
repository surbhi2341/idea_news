import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUser } from '../redux/authSlice.js';
import { Bookmark, Clock, CreditCard, Sparkles, Check, CheckCircle2 } from 'lucide-react';

const ReaderDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showCheckout, setShowCheckout] = useState(null); // plan selected

  useEffect(() => {
    // Read from local storage for reliable mockup data
    const savedBookmarks = JSON.parse(localStorage.getItem('bh_bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    setHistory([
      { title: 'PM Launches Smart Cities Infra Projects...', slug: 'pm-launches-smart-cities', readAt: new Date(Date.now() - 3600000).toLocaleString() },
      { title: 'Cricket Test Match: India Dominates Session', slug: 'cricket-test-india-dominates', readAt: new Date(Date.now() - 86400000).toLocaleString() }
    ]);
  }, []);

  const handleSubscribe = (planName) => {
    // Update user store state to premium
    dispatch(updateUser({
      subscription: { isPremium: true, plan: planName, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
    }));
    setShowCheckout(null);
    alert(`Thank you! You are now subscribed to the Ideaciti News ${planName} Plan.`);
  };

  const handleCancelSubscription = () => {
    dispatch(updateUser({
      subscription: { isPremium: false, plan: 'Free' }
    }));
    alert('Subscription cancelled successfully.');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Plans */}
        <div className="space-y-6">
          {/* Profile Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-250">
            <div className="flex items-center gap-3 border-b pb-3 mb-4">
              <div className="h-10 w-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{user?.name}</h3>
                <p className="text-[10px] text-slate-400">{user?.email || 'Reader Account'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Account Tier:</span>
                <span className={`font-black uppercase text-[10px] px-1.5 py-0.5 rounded ${user?.subscription?.isPremium ? 'bg-yellow-400 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
                  {user?.subscription?.isPremium ? `${user?.subscription?.plan} Premium` : 'Standard Free'}
                </span>
              </div>
              {user?.subscription?.isPremium && (
                <div className="flex justify-between text-slate-450 text-[10px]">
                  <span>Status:</span>
                  <span className="text-green-500 font-bold">Auto-Renewing Active</span>
                </div>
              )}
            </div>

            {user?.subscription?.isPremium && (
              <button 
                onClick={handleCancelSubscription}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-red-500 font-bold text-center py-2 rounded transition-colors text-[10px]"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Pricing tables */}
          {!user?.subscription?.isPremium && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Upgrade to Premium</h3>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Gain access to exclusive editorial analysis, ad-free viewing, and detailed regional state newsletters.</p>

              {/* Monthly card */}
              <div className="border rounded p-3 bg-slate-50/50 dark:bg-slate-800/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Monthly Pass</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">₹99/mo</span>
                </div>
                <button 
                  onClick={() => setShowCheckout('Monthly')}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-extrabold text-[10px] py-1.5 rounded transition-colors shadow-sm"
                >
                  Get Monthly Tier
                </button>
              </div>

              {/* Yearly card */}
              <div className="border rounded p-3 bg-slate-50/50 dark:bg-slate-800/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Yearly Pro</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">₹799/yr</span>
                </div>
                <button 
                  onClick={() => setShowCheckout('Yearly')}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-extrabold text-[10px] py-1.5 rounded transition-colors shadow-sm"
                >
                  Get Yearly Tier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bookmarks & History List */}
        <div className="lg:col-span-2 space-y-6 text-xs font-semibold text-slate-700">
          
          {/* Bookmarks List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Bookmark className="h-5 w-5 text-red-655" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Saved Bookmarks ({bookmarks.length})</h3>
            </div>

            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.map((b, i) => (
                  <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black">{b.category}</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-250 line-clamp-2 mt-1">{b.title}</h4>
                    </div>
                    <Link to={`/news/${b.slug}`} className="text-red-650 font-black hover:underline block text-[10px] text-right">Read Full Story →</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 py-4 text-center">You have no bookmarked articles yet. Click the bookmark icon on any news details page.</p>
            )}
          </div>

          {/* Reading History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Clock className="h-5 w-5 text-red-655" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Reading History</h3>
            </div>

            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="border-b dark:border-slate-800 pb-2 flex justify-between gap-4">
                  <Link to={`/news/${h.slug}`} className="hover:text-red-655 text-slate-700 dark:text-slate-250 truncate">{h.title}</Link>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{h.readAt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Simulated Stripe/UPI Checkout Dialog Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-2 border-b pb-2 text-slate-800 dark:text-slate-100">
              <CreditCard className="h-5 w-5 text-red-650" />
              <h3 className="font-black text-sm uppercase">Secure Simulated Checkout</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Selected Plan:</span>
                <span className="font-bold text-red-650">{showCheckout} Premium</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-black">{showCheckout === 'Monthly' ? '₹99' : '₹799'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded space-y-2">
              <label className="text-[10px] text-slate-400 uppercase">Dummy Card Number</label>
              <input type="text" disabled value="4242 4242 4242 4242" className="w-full p-2 border rounded bg-white dark:bg-slate-900 font-mono tracking-widest text-center" />
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <label className="text-slate-400">EXP</label>
                  <input type="text" disabled value="12/28" className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-center" />
                </div>
                <div>
                  <label className="text-slate-400">CVC</label>
                  <input type="text" disabled value="123" className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-center" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleSubscribe(showCheckout)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-2 rounded text-center"
              >
                Pay & Activate
              </button>
              <button 
                onClick={() => setShowCheckout(null)}
                className="bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:text-slate-250 py-2 px-3 rounded text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderDashboard;
