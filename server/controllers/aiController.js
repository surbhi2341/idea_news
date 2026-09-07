// Mock AI integrations for News Portal features

export const generateHeadline = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title && !content) {
      return res.status(400).json({ success: false, message: 'Please provide some content or draft title' });
    }

    const keyword = title || 'Current Event';
    const suggestions = [
      `Breaking: How ${keyword} is Reshaping the Landscape`,
      `Explained: The Real Impact of ${keyword} on Citizens`,
      `${keyword}: 5 Crucial Key Points You Need to Know`,
      `Exclusive Analysis on the Future of ${keyword}`,
    ];

    // Simulate network delay
    setTimeout(() => {
      res.json({ success: true, headlines: suggestions });
    }, 400);
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide article content' });
    }

    // Generate a mock summary of the content
    const words = content.split(' ');
    const firstSentences = words.slice(0, Math.min(words.length, 30)).join(' ') + '...';
    const summary = `SUMMARY ALERT: This article details how ${firstSentences} Key takeaways address structural transitions, regulatory policies, and ongoing public opinion updates.`;

    setTimeout(() => {
      res.json({ success: true, summary });
    }, 400);
  } catch (error) {
    next(error);
  }
};

export const suggestTags = async (req, res, next) => {
  try {
    const { content, category } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide text for tags suggest' });
    }

    const tags = ['BreakingNews', category || 'General', 'LatestUpdates', 'ExclusiveStory', 'IndiaNews'];
    
    setTimeout(() => {
      res.json({ success: true, tags });
    }, 400);
  } catch (error) {
    next(error);
  }
};

export const grammarCheck = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide content to check' });
    }

    // Return mock grammar alerts
    const suggestions = [
      { original: 'have went', suggestion: 'have gone', index: 12 },
      { original: 'their is', suggestion: 'there is', index: 48 },
    ];

    setTimeout(() => {
      res.json({
        success: true,
        correctedText: content.replace('have went', 'have gone').replace('their is', 'there is'),
        corrections: suggestions
      });
    }, 450);
  } catch (error) {
    next(error);
  }
};

export const detectDuplicate = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }

    // Mock checks
    const score = Math.floor(Math.random() * 25); // returns low probability (0 - 25%)
    res.json({
      success: true,
      isDuplicate: score > 70,
      similarityScore: score,
      message: score > 70 ? 'High similarity with an existing article detected' : 'Article title is unique and fresh',
    });
  } catch (error) {
    next(error);
  }
};
