const express =require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const config = require('./src/config');

mongoose.connect(config.db.uri, {
  createIndexes: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
}).catch((err) => console.log(err.reason));

const app = express();
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', routes);

app.use((req, res, next)=>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    msg: error.message,
  });
});


module.exports = app;
