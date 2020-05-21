const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
  title: String,
  description: {
    type: String,
    required: true
  },
  price: Number,
  platforms: String,
  genre: String,
  size: String,
  publisher: String,
  image: String
}, {
  timestamps: true
})

module.exports = model('Game', gameSchema);