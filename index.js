const express = require('express');
const app = express();
const PORT = 5000;
const { allPath } = require('./helpers/path');
const mainRoutes = require('./routes/main');

const MONGO_URL = 'mongodb://127.0.0.1:27017/todos';
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.static(allPath()));
app.use(mainRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ err: err });
});

mongoose.connect(MONGO_URL, (err) => {
  if (err) return console.log('connection error');
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening port ${PORT}`);
  }
});
