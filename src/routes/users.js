const { Router } = require('express');
const router = Router();
const usersCtrl = require('../controllers/users.controller')
const auth = require('../middleware/auth')

router.route('/')
  .get(usersCtrl.getUsers)
  .post(usersCtrl.createUser);

router.route('/:id')
  .get(usersCtrl.getUser)
  .put(usersCtrl.updateUser)
  .delete(usersCtrl.deleteUser)

router.route('/:id/favorites')
  .get(auth, usersCtrl.getAllFavorites)
  .put(auth, usersCtrl.addToFavorites)

router.route('/:id/favorites/:gameId')
  .delete(auth, usersCtrl.removeFromFavorites)

router.route('/login')
  .post(usersCtrl.logIn)

router.route('/logout')
  .post(usersCtrl.logOut)





module.exports = router;
