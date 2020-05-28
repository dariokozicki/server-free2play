const usersCtrl = {};
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

const domain = (process.env.DOMAIN || 'http://localhost:4000')
const jwtDurationSeconds = (process.env.JWT_DURATION || 1) * 60 * 60

usersCtrl.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users
    .map(user => (
      {
        _id: user._id,
        username: user.username,
        favorites: user.favorites,
        email: user.email,
        createdAt: user.createdAt
      }
    ))
  );
}

usersCtrl.logIn = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username, password: await bcrypt(password, 10) });
  if (user) {
    console.log("User %s logged in", user.username)
    var token = user.generateAuthToken();
    res.status(200).header("x-auth-token", token)
  } else {
    res.status(401).end()
  }

}

usersCtrl.logOut = (req, res) => {
  res.status(200).header("x-auth-token", "").end();
}

usersCtrl.createUser = async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const repeated = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
  if (repeated) return res.status(400).send("User already in use.")
  const user = new User({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    favorites: req.body.favorites,
    email: req.body.email
  })
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    username: user.username,
    email: user.email,
    favorites: user.favorites
  })
}


usersCtrl.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
}


usersCtrl.updateUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)
  const user = await User.findByIdAndUpdate(req.params.id, { username, password, favorites });
  if (user) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
}


usersCtrl.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    console.log('User %s deleted their account.', user.username);
    return res.status(204).end()
  } else {
    return res.status(404).end()
  }
}

usersCtrl.getAllFavorites = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id, username: req.user.username })
    .select("-password")
    .populate("favorites");
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).send("User not found.");
  }

}

usersCtrl.addToFavorites = async (req, res) => {
  const user = await User.updateOne({ _id: req.params.id }, { $addToSet: { favorites: [req.body._id] } })
  return res.status(user ? 201 : 404).end();
}

usersCtrl.removeFromFavorites = async (req, res) => {
  const gameId = req.params.gameId
  const user = await User.updateOne({ _id: req.params.id }, { $pull: { favorites: gameId } });
  return res.status(user ? 204 : 404).end();
}



module.exports = usersCtrl