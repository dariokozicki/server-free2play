const gamesCtrl = {};
const consumer = require('../consumer/games.consumer.js')
const Game = require('../models/Game')

gamesCtrl.getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games)
}

gamesCtrl.getGamesPage = async (req, res) => {
  let query;
  if (req.query.search) {
    regex = (param) => ({
      $regex: ".*" + param + ".*",
      $options: 'i'
    })
    query = {
      $or: [
        {
          "title": regex(req.query.search)
        },
        {
          "publisher": regex(req.query.search)
        },
        {
          "category": regex(req.query.search)
        },
        {
          "website": regex(req.query.search)
        }
      ]
    }
  } else {
    query = {}
  }

  const sortBy = {}
  if (req.query.sortBy) {
    sortBy[req.query.sortBy] = 1;
  }
  const pageSize = 12;
  const skips = pageSize * (req.query.pageNum - 1);
  const games = await Game.find(query).sort(sortBy).skip(skips).limit(pageSize);
  const count = await Game.countDocuments(query);
  res.json({ games: games, total: count });
}

gamesCtrl.createGame = async (req, res) => {
  return res.status(405).end()
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
  return res.status(405).end()
  const { title, category, url, website, websiteId, publisher, image } = req.body;
  const game = await Game.findByIdAndUpdate(req.params.id, { title, category, url, website, websiteId, publisher, image })
  res.json({ message: game ? "Game updated." : "Game not found." })
}


gamesCtrl.deleteGame = async (req, res) => {
  return res.status(405).end()
  const game = await Game.findByIdAndDelete(req.params.id);
  res.json({ message: game ? "Game deleted." : "Game not found." })
}




module.exports = gamesCtrl