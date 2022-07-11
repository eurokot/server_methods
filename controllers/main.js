const { createPath } = require('../helpers/path');
const Todo = require('../models/Todo');

const get = async (req, res, next) => {
  const data = await Todo.find();
  res.status(201).send(data);
};
const add = async (req, res) => {
  const { todo } = req.body;
  await Todo.create({ text: todo });

  res.status(201).end();
};
const update = async (req, res, next) => {
  const { todo } = req.body;
  const { id } = req.params;

  await Todo.findByIdAndUpdate(id, { text: todo });
  res.status(201).end();
};
const remove = async (req, res, next) => {
  const { id } = req.params;

  await Todo.deleteOne({ _id: id });
  res.status(201).end();
};
const all = (req, res) => {
  res.sendFile(createPath('error'));
};

module.exports = {
  get,
  add,
  update,
  remove,
  all,
};
