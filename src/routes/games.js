const { Router } = require('express');
const router = Router();
const gamesCtrl = require('../controllers/games.controller')

router.route('/')
  .get(gamesCtrl.getGamesPage)
  .post(gamesCtrl.createGame);

router.route('/:id')
  .get(gamesCtrl.getGame)
  .put(gamesCtrl.updateGame)
  .delete(gamesCtrl.deleteGame)








module.exports = router;