const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken')
const Joi = require('joi');
const key = process.env.SECRET_KEY || 'myultrasecretsalt'
const jwtDurationSeconds = (process.env.JWT_DURATION || 1) * 60 * 60

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favorites: [{
    type: [Schema.Types.ObjectId],
    ref: "Game"
  }]
}, {
  timestamps: true
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, username: this.username }, key,
    { expiresIn: jwtDurationSeconds });
  return token;
}

function validateUser(user) {
  const schema = {
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
    favorites: Joi.array().required()
  };

  return Joi.validate(user, schema);
}

exports.User = model('User', userSchema)
exports.validate = validateUser