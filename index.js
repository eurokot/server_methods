const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const PORT = 5000;
const app = express();

fs.access(path.join(__dirname, 'todoList.json')).catch((err) => {
  fs.writeFile(
    path.join(__dirname, 'todoList.json'),
    JSON.stringify([], null, 2)
  );
});

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'static')));

app.get('/todos', async (req, res, next) => {
  try {
    const file = await fs.readFile(path.join(__dirname, 'todoList.json'));
    const data = file.toString();

    res.status(200).send(data);
  } catch (err) {
    res.status(200).send();
  }
});

app.post('/todos', async (req, res) => {
  const { todo } = req.body;

  try {
    const file = await fs.readFile(path.join(__dirname, 'todoList.json'));
    const data = JSON.parse(file.toString());

    data.push({
      id: crypto.randomUUID(),
      task: todo,
    });

    await fs.writeFile(
      path.join(__dirname, 'todoList.json'),
      JSON.stringify(data, null, 2)
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

app.put('/todos/:id', async (req, res, next) => {
  const { todo } = req.body;
  const { id } = req.params;

  try {
    const file = await fs.readFile(path.join(__dirname, 'todoList.json'));
    const data = JSON.parse(file.toString());

    data.find((elem) => {
      if (elem.id == id) {
        elem.task = todo;
      }
    });

    await fs.writeFile(
      path.join(__dirname, 'todoList.json'),
      JSON.stringify(data, null, 2)
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

app.delete('/todos/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const file = await fs.readFile(path.join(__dirname, 'todoList.json'));
    let data = JSON.parse(file.toString());

    data = data.filter((elem) => {
      return elem.id !== id;
    });

    await fs.writeFile(
      path.join(__dirname, 'todoList.json'),
      JSON.stringify(data, null, 2)
    );
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'error.html'));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ err: err });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening port ${PORT}`);
  }
});
