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

  shuffledCards: {
    type: Map,
    of: [Object], // Stores shuffled array of card objects for each level
    default: {}
  }

}, { timestamps: true

    
    // answers: {
    //     level5: { type: Object, default: {} },
    //     level7: { type: String, default: '' },
    //     level8: { type: String, default: '' },
    //     level9: { type: String, default: '' },
    //     level10: {
    //         morse: { type: String, default: '' },
    //         binary: { type: String, default: '' },
    //         emoji: { type: String, default: '' },
    //         logic: { type: String, default: '' },
    //     }
    // }
    
});

export const GameProgress = mongoose.model('GameProgress', gameProgressSchema);
