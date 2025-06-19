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
      const allVariants = await Level.find({ levelNumber: Number(level) });
      if (!allVariants.length) {
        return res.status(404).json({ error: 'No variants found for this level' });
      }

      const random = allVariants[Math.floor(Math.random() * allVariants.length)];
      assignedId = random._id.toString();

      progress.assignedLevels.set(level, assignedId);
      await progress.save();

      return res.json({
        question: random.question,
        data: random.data, 
        id: random._id
      });
    } else {
      const existing = await Level.findById(assignedId);
      return res.json({ question: existing.question, data : existing.data, id: existing._id });
    }

  } catch (err) {
    console.error('Error fetching level data:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const submitAnswer = async (req, res) => {
  const userId = req.id;
  const level = req.params.level;

  try {
    const progress = await GameProgress.findOne({ user: userId });
    if (!progress) return res.status(400).json({ error: 'Game progress not found' });

    const assignedId = progress.assignedLevels.get(level);
    if (!assignedId) return res.status(400).json({ error: 'No question assigned yet' });

    const levelData = await Level.findById(assignedId);
    if (!levelData) return res.status(404).json({ error: 'Assigned level data not found' });

    const answerType = levelData.answerType;

    let isCorrect = false;

    if (answerType === "string") {
      const userAnswer = req.body.answer?.trim().toLowerCase();
      const correctAnswer = levelData.correctAnswer.trim().toLowerCase();
      isCorrect = userAnswer === correctAnswer;
    } 

    else if (answerType === "coordinates") {
      const { x, y } = req.body;
      const { x1, y1, x2, y2 } = levelData.correctAnswer;

      isCorrect =
        x >= Math.min(x1, x2) &&
        x <= Math.max(x1, x2) &&
        y >= Math.min(y1, y2) &&
        y <= Math.max(y1, y2);
    } 

    else if (answerType === "wordle") {
      const userGuess = req.body.answer?.toLowerCase();
      const correctWord = levelData.correctAnswer.toLowerCase();

      if (!userGuess || userGuess.length !== correctWord.length) {
        return res.status(400).json({ error: 'Invalid word length' });
      }

      const feedback = [];
      const correctUsed = Array(correctWord.length).fill(false);

      // First pass: check correct positions
      for (let i = 0; i < correctWord.length; i++) {
        if (userGuess[i] === correctWord[i]) {
          feedback[i] = "correct";
          correctUsed[i] = true;
        } else {
          feedback[i] = "";
        }
      }

      // Second pass: check for present but misplaced letters
      for (let i = 0; i < correctWord.length; i++) {
        if (feedback[i]) continue;

        let found = false;
        for (let j = 0; j < correctWord.length; j++) {
          if (!correctUsed[j] && userGuess[i] === correctWord[j]) {
            found = true;
            correctUsed[j] = true;
            break;
          }
        }

        feedback[i] = found ? "present" : "absent";
      }

      isCorrect = userGuess === correctWord;

      if (isCorrect) {
        const levelIndex = parseInt(level.split('.')[0]) - 1;
        if (!progress.levelStatus[levelIndex]) {
          progress.levelStatus[levelIndex] = true;
          progress.score += 10;
        }
        await progress.save();
        return res.json({
          success: true,
          message: "Correct answer",
          feedback,
        });
      } else {
        return res.json({
          success: false,
          message: "Wrong answer",
          feedback,
        });
      }
    }

    else {
      return res.status(400).json({ error: "Unsupported answer type" });
    }

    if (isCorrect) {
      const levelIndex = parseInt(level.split('.')[0]) - 1;
      if (!progress.levelStatus[levelIndex]) {
        progress.levelStatus[levelIndex] = true;
        progress.score += 10;
      }

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
