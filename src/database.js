const mongoose = require('mongoose');
const consumer = require('./consumer/games.consumer.js')

const URI = process.env.MONGODB_URI || 'mongodb://localhost/merntest';

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', async () => {
  console.log("Database is connected")
  await consumer.updateGames();
});