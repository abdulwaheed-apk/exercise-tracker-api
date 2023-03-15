const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    exerciseName: {
      type: String,
      required: [true, 'kindly add exercise name'],
    },
    exerciseType: {
      type: String,
      enum: ['Running', 'Swimming', 'Walking', 'Bicycling', 'Hiking'],
    },
    duration: {
      type: Number,
      default: 30,
    },
    date: {
      type: Date,
      // default: Date.now(),
    },
    details: {
      type: String,
    },
    distance: {
      type: Number,
    },
    calories: {
      type: Number,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
