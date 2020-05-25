const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
  title: String,
  category: String,
  url: String,
  website: String,
  websiteId: String,
  publisher: String,
  image: String
}, {
  timestamps: true
})


module.exports = model('Game', gameSchema);