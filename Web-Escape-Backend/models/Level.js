import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
  },
  question: {
    type: String, // This can be a description, image URL, riddle text, etc.
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // use this for extra data like options, images, etc.
    default: {},
  },
  correctAnswer: {
    type: String, // or array/number depending on level type
    required: true,
  }
});

export const Level = mongoose.model('Level', levelSchema);
