import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  answerType: {
    type: String,
    enum: ['string', 'coordinates'],
    required: true,
  }
});

export const Level = mongoose.model('Level', levelSchema);

