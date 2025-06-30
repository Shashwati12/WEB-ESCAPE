import { GameProgress } from '../models/GameProgress.js';

export const getOrCreateProgress = async (req, res) => {
  try {
    const userId = req.id;

    let progress = await GameProgress.findOne({ user: userId });

    if (!progress) {
      progress = await GameProgress.create({ user: userId });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error in getOrCreateProgress:', error);
    res.status(500).json({ error: 'Failed to fetch game progress' });
  }
};

export const resetProgress = async (req, res) => {
  try {
    const userId = req.id;

    const resetData = {
      currentLevel: 0,
      levelStatus: Array(10).fill(false),
      score: 0,
      timer: 0,
      assignedLevels: {},
    };

    const progress = await GameProgress.findOneAndUpdate(
      { user: userId },
      { $set: resetData },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json({ message: 'Progress reset successfully', progress });
  } catch (error) {
    console.error('Error in resetProgress:', error);
    res.status(500).json({ error: 'Failed to reset game progress' });
  }
};

