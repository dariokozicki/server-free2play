const usersCtrl = {};
const User = require('../models/User')

usersCtrl.getUsers = async (req, res) => {
  const user = await User.find();
  res.json(user);
}


usersCtrl.createUser = async (req, res) => {
  const { username } = req.body;
  const user = await User.create({ username });
  res.json({ message: "User saved.", id: user._id })
}


usersCtrl.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user || { message: "User not found." });
}


usersCtrl.updateUser = async (req, res) => {
  const { username } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { username });
  res.json({ message: user ? "User updated." : "User not found" })
}


usersCtrl.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json({ message: user ? "User deleted." : "User not found" })
}





module.exports = usersCtrl