import { GameProgress } from '../models/GameProgress.js';
import { Level } from '../models/Level.js';

// Get a level's question (randomized once per user)
export const getLevelData = async (req, res) => {
  const userId = req.id;
  const level = req.params.level; // e.g., "1" or "10.morse"

  try {
    let progress = await GameProgress.findOne({ user: userId });
    if (!progress) {
      progress = await GameProgress.create({ user: userId });
    }

    let assignedId = progress.assignedLevels.get(level);

    if (!assignedId) {
      const allVariants = await Level.find({ levelNumber: level });
      if (!allVariants.length) {
        return res.status(404).json({ error: 'No variants found for this level' });
      }

      const random = allVariants[Math.floor(Math.random() * allVariants.length)];
      assignedId = random._id.toString();

      progress.assignedLevels.set(level, assignedId);
      await progress.save();

      return res.json({ question: random.question, id: random._id });
    } else {
      const existing = await Level.findById(assignedId);
      return res.json({ question: existing.question, id: existing._id });
    }

  } catch (err) {
    console.error('Error fetching level data:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Answer submission and validation
export const submitAnswer = async (req, res) => {
  const userId = req.id;
  const level = req.params.level;
  const userAnswer = req.body.answer?.trim().toLowerCase();
  try {
    const progress = await GameProgress.findOne({ user: userId });
    if (!progress) return res.status(400).json({ error: 'Game progress not found' });

    const assignedId = progress.assignedLevels.get(level);
    if (!assignedId) return res.status(400).json({ error: 'No question assigned yet' });

    const levelData = await Level.findById(assignedId);
    if (!levelData) return res.status(404).json({ error: 'Assigned level data not found' });

    const correctAnswer = levelData.correctAnswer.trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      const levelIndex = parseInt(level.split('.')[0]) - 1;
      if (!progress.levelStatus[levelIndex]) {
        progress.levelStatus[levelIndex] = true;
        progress.score += 10;
      }

      // progress.answers.set(level, userAnswer);
      await progress.save();

      return res.json({ success: true, message: 'Correct answer' });
    } else {
      return res.json({ success: false, message: 'Wrong answer' });
    }

  } catch (err) {
    console.error('Submit answer error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


