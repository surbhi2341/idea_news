import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ThumbsUp, CornerDownRight, MessageSquare, AlertCircle } from 'lucide-react';

const CommentsSection = ({ newsId }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [replyTarget, setReplyTarget] = useState(null); // comment object to reply to
  const [replyText, setReplyText] = useState('');
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/news/${newsId}`);
      if (res.data.success) {
        setComments(res.data.comments);
        setReplies(res.data.replies || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const payload = {
        newsId,
        content: newComment,
        guestName: !isAuthenticated ? guestName || 'Anonymous Reader' : undefined,
      };

      const token = localStorage.getItem('bh_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post('/api/comments', payload, config);
      if (res.data.success) {
        setComments(prev => [res.data.comment, ...prev]);
        setNewComment('');
        setGuestName('');
      }
    } catch (err) {
      alert('Failed to submit comment');
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const payload = {
        newsId,
        content: replyText,
        parentCommentId: commentId,
        guestName: !isAuthenticated ? guestName || 'Anonymous Reader' : undefined,
      };

      const token = localStorage.getItem('bh_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post('/api/comments', payload, config);
      if (res.data.success) {
        const reply = res.data.comment;
        setReplies(prev => ({
          ...prev,
          [commentId]: [reply, ...(prev[commentId] || [])]
        }));
        setReplyText('');
        setReplyTarget(null);
      }
    } catch (err) {
      alert('Failed to submit reply');
    }
  };

  const handleLike = async (commentId, isReply, parentId) => {
    if (!isAuthenticated) {
      alert('Please log in to like comments');
      return;
    }

    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post(`/api/comments/id/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Update states
        if (isReply) {
          setReplies(prev => {
            const list = prev[parentId] || [];
            const updated = list.map(c => c._id === commentId ? { ...c, likes: res.data.hasLiked ? [...c.likes, user.id] : c.likes.filter(id => id !== user.id) } : c);
            return { ...prev, [parentId]: updated };
          });
        } else {
          setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: res.data.hasLiked ? [...c.likes, user.id] : c.likes.filter(id => id !== user.id) } : c));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (commentId) => {
    try {
      const res = await axios.post(`/api/comments/id/${commentId}/report`);
      if (res.data.success) {
        alert('Thank you, this comment has been flagged for review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const CommentCard = ({ comment, isReply = false, parentId = null }) => {
    const authorName = comment.user ? comment.user.name : comment.guestName;
    const authorRole = comment.user?.role;
    const likesCount = comment.likes?.length || 0;
    const hasLiked = isAuthenticated && comment.likes?.includes(user?.id);

    return (
      <div className={`p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 ${isReply ? 'ml-6 border-l-2 border-l-red-500' : ''}`}>
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{authorName}</span>
            {authorRole && authorRole !== 'Reader' && (
              <span className="text-[9px] bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 px-1 py-0.5 rounded uppercase font-black">{authorRole}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{comment.content}</p>
        
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <button 
            onClick={() => handleLike(comment._id, isReply, parentId)} 
            className={`flex items-center gap-1 hover:text-red-500 transition-colors ${hasLiked ? 'text-red-600 font-bold' : ''}`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>{likesCount} Likes</span>
          </button>
          {!isReply && (
            <button 
              onClick={() => setReplyTarget(replyTarget === comment._id ? null : comment._id)} 
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Reply</span>
            </button>
          )}
          <button 
            onClick={() => handleReport(comment._id)} 
            className="flex items-center gap-1 hover:text-red-500 transition-colors ml-auto opacity-60 hover:opacity-100"
          >
            <AlertCircle className="h-3 w-3" />
            <span>Report</span>
          </button>
        </div>

        {/* Reply Submission Input */}
        {replyTarget === comment._id && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!isAuthenticated && (
              <input
                type="text"
                placeholder="Your Name (Guest)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
              <button 
                onClick={() => handleSubmitReply(comment._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Render Replies list */}
        {!isReply && replies[comment._id]?.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies[comment._id].map((reply) => (
              <CommentCard key={reply._id} comment={reply} isReply={true} parentId={comment._id} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b pb-2 tracking-tight">READER DISCUSSION</h3>
      
      {/* Primary Comment Input */}
      <form onSubmit={handleSubmitComment} className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
        {!isAuthenticated && (
          <input
            type="text"
            placeholder="Your Name (Guest)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full max-w-xs text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 outline-none"
          />
        )}
        <div className="flex gap-2">
          <textarea
            placeholder="Share your thoughts on this story..."
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-red-500 outline-none resize-none"
          />
          <button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded transition-colors self-end"
          >
            Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No comments yet. Be the first to share your feedback!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
