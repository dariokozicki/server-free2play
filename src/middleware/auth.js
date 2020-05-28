var jwt = require('jsonwebtoken')

const key = process.env.SECRET_KEY || 'myultrasecretsalt'


module.exports = function (req, res, next) {
  const token = req.headers["x-auth-token"] || req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, key);
    if (!decoded) return res.status(400).send("Token corresponds with nonexistent user.")
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};