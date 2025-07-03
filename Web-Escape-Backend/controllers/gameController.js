import { GameProgress } from '../models/GameProgress.js';

export const getOrCreateProgress = async (req, res) => {
  try {
    const userId = req.id;

    let progress = await GameProgress.findOne({ user: userId });

    if (!progress) {
      progress = await GameProgress.create({ user: userId ,
        currentLevel: 0,
        levelStatus: Array(10).fill(false),
        score: 0,
        timer: 0,
        assignedLevels: {},
        levelAttempts: Array.from({ length: 10 }, (value, index) => ({
          levelNumber: index + 1,
          attemptsLeft: 3,
          retriesUsed: 0
        }))
      });
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
      levelAttempts: Array.from({ length: 10 }, (value, index) => ({
        levelNumber: index + 1,
        attemptsLeft: 3,
        retriesUsed: 0
      }))
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

export const updateTime = async (req, res) => {
  try {
    const userId = req.id;
    const { timer } = req.body;

    if (typeof timer !== 'number' || timer < 0) {
      return res.status(400).json({ error: 'Invalid time value' });
    }

    const progress = await GameProgress.findOneAndUpdate(
      { user: userId },
      { $set: { timer } },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json({ message: 'Time updated successfully', progress });
  } catch (error) {
    console.error('Error updating time:', error);
    res.status(500).json({ error: 'Failed to update time' });
  }
};

export const retryLevel = async (req, res) => {
  try {
    const userId = req.id;
    const level = parseInt(req.params.level);

    const progress = await GameProgress.findOne({ user: userId });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    // Find the levelAttempt object
    const levelData = progress.levelAttempts.find(
      (lvl) => lvl.levelNumber === level
    );

    if (!levelData) {
      return res.status(404).json({ error: 'Level attempt data not found' });
    }

    if (progress.score < 5) {
      return res.status(400).json({ error: 'Not enough score to retry' });
    }

    // Deduct score and reset attempts
    progress.score -= 5;
    levelData.attemptsLeft = 3;
    levelData.retriesUsed += 1;

    await progress.save();

    res.status(200).json({
      message: 'Retry successful',
      newAttempts: levelData.attemptsLeft,
      scoreLeft: progress.score,
      retriesUsed: levelData.retriesUsed,
    });
  } catch (error) {
    console.error('Error in retryLevel:', error);
    res.status(500).json({ error: 'Retry failed' });
  }
};

export const useAttempt = async (req, res) => {
  try {
    const userId = req.id;
    const level = parseInt(req.params.level);

    const progress = await GameProgress.findOne({ user: userId });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const levelData = progress.levelAttempts.find(
      (lvl) => lvl.levelNumber === level
    );

    if (!levelData) {
      return res.status(404).json({ error: 'Level attempt data not found' });
    }

    if (levelData.attemptsLeft <= 0) {
      return res.status(400).json({ error: 'No attempts left' });
    }

    levelData.attemptsLeft -= 1;

    await progress.save();

    res.status(200).json({
      message: 'Attempt used',
      attemptsLeft: levelData.attemptsLeft
    });
  } catch (error) {
    console.error('Error in useAttempt:', error);
    res.status(500).json({ error: 'Failed to use attempt' });
  }
};



