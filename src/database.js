const mongoose = require("mongoose");
const consumer = require("./consumer/games.consumer.js");
const days = process.env.GAME_UPDATE_FREQUENCY_DAYS || 1;

const URI = process.env.MONGODB_URI || "mongodb://localhost/merntest";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database is connected");
  console.log("Setting interval for API requests every %d day(s)", days);
  // consumer.updateGames();
  // setInterval(consumer.updateGames, days * 1000 * 60 * 60 * 24)
});
