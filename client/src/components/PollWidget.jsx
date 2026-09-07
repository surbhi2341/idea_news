import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Vote, CheckCircle2 } from 'lucide-react';

const PollWidget = () => {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fetchActivePoll = async () => {
    try {
      const res = await axios.get('/api/polls/active');
      if (res.data.success && res.data.poll) {
        setPoll(res.data.poll);
        // Check if user already voted
        if (user && res.data.poll.voters.includes(user.id)) {
          setHasVoted(true);
        }
      }
    } catch (err) {
      console.error('Failed to load active poll', err);
    }
  };

  useEffect(() => {
    fetchActivePoll();
  }, [user]);

  // Fallback default mock poll if DB has no active poll
  const getFallbackPoll = () => {
    return {
      _id: 'fallback-poll-id',
      question: 'Do you support the implementation of new AI anchors in regional news channels?',
      options: [
        { _id: 'o1', text: 'Yes, it makes news delivery faster and modern', votes: 1420 },
        { _id: 'o2', text: 'No, human anchors convey real emotions better', votes: 2450 },
        { _id: 'o3', text: 'Neutral / Should be a mix of both', votes: 412 },
      ]
    };
  };

  const activePoll = poll || getFallbackPoll();

  const handleVote = async (optionId) => {
    if (hasVoted) return;
    setLoading(true);
    try {
      if (poll) {
        const token = localStorage.getItem('bh_token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.post(`/api/polls/id/${poll._id}/vote`, { optionId }, config);
        if (res.data.success) {
          setPoll(res.data.poll);
          setHasVoted(true);
        }
      } else {
        // For fallback mock poll, just increment state locally
        const updated = { ...activePoll };
        const opt = updated.options.find(o => o._id === optionId);
        if (opt) {
          opt.votes += 1;
          setPoll(updated);
          setHasVoted(true);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = activePoll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="h-5 w-5 text-red-600 dark:text-red-500" />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight uppercase">Ideaciti POLL</h3>
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{activePoll.question}</p>

      <div className="space-y-3">
        {activePoll.options.map((opt) => {
          const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={opt._id} className="relative">
              {hasVoted ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded p-2.5 bg-slate-50 dark:bg-slate-800/40 overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-red-100 dark:bg-red-950/30 transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                  <div className="relative flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{opt.text}</span>
                    <span className="text-red-600 dark:text-red-400 font-bold ml-2">{percent}%</span>
                  </div>
                </div>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => handleVote(opt._id)}
                  className="w-full text-left border border-slate-200 dark:border-slate-800 rounded p-2.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/10 transition-all outline-none font-medium flex items-center justify-between"
                >
                  <span>{opt.text}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span>Thank you for voting</span>
          </div>
          <span>Total: {totalVotes} votes</span>
        </div>
      )}
    </div>
  );
};

export default PollWidget;
