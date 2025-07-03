import mongoose from 'mongoose';


// Sub-schema for each level's attempts
const levelAttemptSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  attemptsLeft: { type: Number, default: 3 },
  retriesUsed: { type: Number, default: 0 }
}, { _id: false });

const gameProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  currentLevel: { type: Number, default: 0 },

  levelStatus: { type: [Boolean], default: Array(10).fill(false) },

  score: { type: Number, default: 0 },

  timer: { type: Number, default: 0 },

  assignedLevels: {
    type: Map,
    of: String, // Stores variant IDs assigned to this user
    default: {}
  },

  // new addition
    levelAttempts: {
    type: [levelAttemptSchema],
    default: () =>
      Array.from({ length: 10 }, (value, index) => ({
        levelNumber: index + 1,
        attemptsLeft: 3,
        retriesUsed: 0
      }))
  },


}, { timestamps: true

});

export const GameProgress = mongoose.model('GameProgress', gameProgressSchema);
