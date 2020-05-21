const { Router } = require('express');
const router = Router();
const usersCtrl = require('../controllers/users.controller')

router.route('/')
  .get(usersCtrl.getUsers)
  .post(usersCtrl.createUser);

router.route('/:id')
  .get(usersCtrl.getUser)
  .put(usersCtrl.updateUser)
  .delete(usersCtrl.deleteUser)







module.exports = router;
