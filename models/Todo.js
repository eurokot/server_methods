const mongoose = require('mongoose');

const schema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Todo = new mongoose.model('Todo', schema);

module.exports = Todo;
