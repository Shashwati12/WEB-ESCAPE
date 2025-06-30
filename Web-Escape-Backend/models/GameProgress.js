import mongoose from 'mongoose';

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


}, { timestamps: true

});

export const GameProgress = mongoose.model('GameProgress', gameProgressSchema);
