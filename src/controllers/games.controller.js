const gamesCtrl = {};
const consumer = require('../consumer/games.consumer')
const Game = require('../models/Game')

gamesCtrl.getGames = async (req, res) => {
  //const games = await Game.find();
  const games = await consumer.updateGames();
  res.json(games)
}


gamesCtrl.createGame = async (req, res) => {
  const { title, description, price, platforms, genre, size, publisher, image } = req.body;
  const game = await Game.create({ title, description, price, platforms, genre, size, publisher, image })
  res.json({ message: "Game created.", id: game._id });
}


gamesCtrl.getGame = async (req, res) => {
  const { title, description, price, platforms, genre, size, publisher, image } = req.body;
  const game = await Game.findById(req.params.id, { title, description, price, platforms, genre, size, publisher, image })
  res.json(game || { message: "Game not found." });
}


gamesCtrl.updateGame = async (req, res) => {
  const { title, description, price, platforms, genre, size, publisher } = req.body;
  const game = await Game.findByIdAndUpdate(req.params.id, { title, description, price, platforms, genre, size, publisher, image })
  res.json({ message: game ? "Game updated." : "Game not found." })
}


gamesCtrl.deleteGame = async (req, res) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  res.json({ message: game ? "Game deleted." : "Game not found." })
}





module.exports = gamesCtrl