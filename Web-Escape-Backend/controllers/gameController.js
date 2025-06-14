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

export const updateProgress = async (req, res) => {
  try {
    const userId = req.id;
    const updateData = req.body;

    const progress = await GameProgress.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error in updateProgress:', error);
    res.status(500).json({ error: 'Failed to update game progress' });
  }
};

