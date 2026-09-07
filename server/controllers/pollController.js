import Poll from '../models/Poll.js';

export const createPoll = async (req, res, next) => {
  try {
    const { question, options, expiresAt } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Question and at least 2 options are required' });
    }

    // Deactivate previous active polls
    await Poll.updateMany({ isActive: true }, { isActive: false });

    const poll = await Poll.create({
      question,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    });

    res.status(201).json({ success: true, poll });
  } catch (error) {
    next(error);
  }
};

export const getPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (error) {
    next(error);
  }
};

export const getActivePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findOne({ isActive: true });
    res.json({ success: true, poll });
  } catch (error) {
    next(error);
  }
};

export const votePoll = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    if (!optionId) {
      return res.status(400).json({ success: false, message: 'Please specify optionId to vote' });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll || !poll.isActive) {
      return res.status(404).json({ success: false, message: 'Active poll not found' });
    }

    // Prevent double voting for authenticated users
    if (req.user) {
      if (poll.voters.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: 'You have already voted on this poll' });
      }
      poll.voters.push(req.user._id);
    }

    // Increment vote count
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(400).json({ success: false, message: 'Option not found' });
    }
    option.votes += 1;

    await poll.save();
    res.json({ success: true, poll });
  } catch (error) {
    next(error);
  }
};

export const deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }
    res.json({ success: true, message: 'Poll deleted' });
  } catch (error) {
    next(error);
  }
};
