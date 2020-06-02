const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser")

// settings
app.set('port', process.env.PORT || 4000);

//middlewares
const corsOptions = {
  exposedHeaders: 'x-auth-token'
}


app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());


//routes
app.use('/api/users', require('./routes/users'))
app.use('/api/games', require('./routes/games'))
app.use('/', (req, res) => { res.status(200).end() })
module.exports = app;