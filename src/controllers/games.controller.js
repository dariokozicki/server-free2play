const gamesCtrl = {};
const consumer = require('../consumer/games.consumer')
const Game = require('../models/Game')

gamesCtrl.getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games)
}

gamesCtrl.getGamesPage = async (req, res) => {
  const pageSize = 12;
  const skips = pageSize * (req.query.pageNum - 1);
  const games = await Game.find().skip(skips).limit(pageSize);
  const count = await Game.countDocuments();
  res.json({ games: games, total: count });
}

gamesCtrl.createGame = async (req, res) => {
  const { title, category, url, website, websiteId, publisher, image } = req.body;
  const game = await Game.create({ title, category, url, website, websiteId, publisher, image })
  res.json({ message: "Game created.", id: game._id });
}


gamesCtrl.getGame = async (req, res) => {
  const { title, category, url, website, websiteId, publisher, image } = req.body;
  const game = await Game.findById(req.params.id, { title, category, url, website, websiteId, publisher, image })
  res.json(game || { message: "Game not found." });
}


gamesCtrl.updateGame = async (req, res) => {
  const { title, category, url, website, websiteId, publisher, image } = req.body;
  const game = await Game.findByIdAndUpdate(req.params.id, { title, category, url, website, websiteId, publisher, image })
  res.json({ message: game ? "Game updated." : "Game not found." })
}


gamesCtrl.deleteGame = async (req, res) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  res.json({ message: game ? "Game deleted." : "Game not found." })
}




module.exports = gamesCtrl