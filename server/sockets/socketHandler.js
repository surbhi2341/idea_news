// Track active real-time readers per article room
const activeReadersMap = new Map();

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Live news article room & real-time reader tracking
    socket.on('join_article', (articleId) => {
      if (!articleId) return;
      socket.join(articleId);
      
      if (!activeReadersMap.has(articleId)) {
        activeReadersMap.set(articleId, new Set());
      }
      activeReadersMap.get(articleId).add(socket.id);

      const count = activeReadersMap.get(articleId).size;
      // Emit live readers count to the article room
      io.to(articleId).emit('active_readers_count', { articleId, activeReaders: count });
      console.log(`Socket ${socket.id} joined article: ${articleId} (Active readers: ${count})`);
    });

    socket.on('leave_article', (articleId) => {
      if (!articleId) return;
      socket.leave(articleId);
      
      if (activeReadersMap.has(articleId)) {
        activeReadersMap.get(articleId).delete(socket.id);
        const count = activeReadersMap.get(articleId).size;
        io.to(articleId).emit('active_readers_count', { articleId, activeReaders: count });
        if (count === 0) activeReadersMap.delete(articleId);
      }
      console.log(`Socket ${socket.id} left article: ${articleId}`);
    });

    socket.on('disconnecting', () => {
      // Remove socket from all article reader tracking
      for (const [articleId, socketSet] of activeReadersMap.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);
          const count = socketSet.size;
          io.to(articleId).emit('active_readers_count', { articleId, activeReaders: count });
          if (count === 0) activeReadersMap.delete(articleId);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });
};

export const emitLiveBlogUpdate = (io, articleId, update) => {
  if (io) {
    io.to(articleId).emit('live_blog_update', update);
    console.log(`[Socket] Live blog update sent to room ${articleId}`);
  }
};

export const emitBreakingNews = (io, newsItem) => {
  if (io) {
    io.emit('breaking_news', newsItem);
    console.log(`[Socket] Breaking news alert broadcasted`);
  }
};

export const emitCricketUpdate = (io, scoreData) => {
  if (io) {
    io.emit('cricket_score', scoreData);
  }
};

export const emitMarketUpdate = (io, marketData) => {
  if (io) {
    io.emit('market_data', marketData);
  }
};

export const emitNewsViewUpdate = (io, articleId, slug, views) => {
  if (io) {
    io.emit('news_view_update', { articleId, slug, views });
    console.log(`[Socket] News view update broadcasted for ${slug || articleId}: ${views} views`);
  }
};

