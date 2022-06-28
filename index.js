const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const PORT = 5000;
const app = express();

app.use(express.json());

app.get('*', (req, res, next) => {
  let route = req.url;

  if (route == '/') {
    route = '/index.html';
  }

  let file = path.join(__dirname, 'static', route);

  if (!path.parse(file).dir.includes(path.join(__dirname, 'static'))) {
    res.status(404).end();
  }

  fs.stat(file)
    .then(async (data) => {
      if (data.isDirectory()) {
        const dataDir = await fs.readdir(file);
        res.status(200).json(dataDir);
      }

      if (data.isFile()) {
        res.status(200).sendFile(file);
      }
    })
    .catch((err) => {
      if (route == '/todoList.json') {
        fs.readFile(path.join(__dirname, 'todoList.json'))
          .then((data) => res.send(data))
          .catch((err) => res.send());
      } else {
        res.status(404).sendFile(path.join(__dirname, 'static', 'error.html'));
      }
    });
});

app.post('/todos', (req, res) => {
  const { todo } = req.body;

  fs.readFile(path.join(__dirname, 'todoList.json'))
    .then((data) => {
      const arr = JSON.parse(data);
      arr.push({
        id: crypto.randomBytes(16).toString('hex'),
        task: todo,
      });
      fs.writeFile(
        path.join(__dirname, 'todoList.json'),
        JSON.stringify(arr, null, 2)
      );
    })
    .catch((err) => {
      const arr = [];
      arr.push({
        id: crypto.randomBytes(16).toString('hex'),
        task: todo,
      });
      fs.writeFile(
        path.join(__dirname, 'todoList.json'),
        JSON.stringify(arr, null, 2)
      );
    });

  res.redirect('/');
});

app.put('/todos/:id', (req, res, next) => {
  const { todo } = req.body;
  const { id } = req.params;

  fs.readFile(path.join(__dirname, 'todoList.json'))
    .then((data) => {
      let arr = JSON.parse(data);

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          arr[i].task = todo;
        } else {
          continue;
        }
      }

      fs.writeFile(
        path.join(__dirname, 'todoList.json'),
        JSON.stringify(arr, null, 2)
      )
        .then((result) => {
          res.status(200).end();
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

app.delete('/todos/:id', (req, res, next) => {
  const { id } = req.params;
  fs.readFile(path.join(__dirname, 'todoList.json'))
    .then((data) => {
      let arr = JSON.parse(data);

      if (arr.length == 1) {
        fs.unlink(path.join(__dirname, 'todoList.json'))
          .then((result) => res.status(200).end())
          .catch((err) => next(err));
      } else {
        arr = arr.filter((elem) => {
          return elem.id !== id;
        });

        fs.writeFile(
          path.join(__dirname, 'todoList.json'),
          JSON.stringify(arr, null, 2)
        )
          .then((result) => res.status(200).end())
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ err: err }).end();
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening port ${PORT}`);
  }
});
