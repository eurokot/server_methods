const todoList = document.getElementById('todo-list');
const form = document.getElementById('todo-form');

const createTemplate = (task, id) => {
  return `
      <div class='item'>
          <input class="check" type="radio">
          <p>${task}</p>
          <button data-edit="${id}" title="Alert">
            <i data-edit="${id}" class='bx bxs-pencil alert'></i>
          </button>
          <button class="btn-delete" data-delete="${id}" title="Remove">
            <i data-delete="${id}" class='bx bxs-trash trash'></i>
          </button>
      </div> `;
};

const emptyTemplate = () => {
  return `
      <div class='item'>
        <h1 style="color: red">No records</h1>
      </div> `;
};

async function getData() {
  document.getElementById('todo-input').value = '';
  try {
    const response = await fetch('/todos');
    const data = await response.json();
    todoList.innerHTML = '';

    return data.length
      ? data.forEach((item) => {
          todoList.innerHTML += createTemplate(item.text, item._id);
        })
      : (todoList.innerHTML += emptyTemplate());
  } catch (err) {
    console.error(err);
  }
}

getData();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let todo = document.getElementById('todo-input').value;
  return fetch('todos', {
    method: 'POST',
    body: JSON.stringify({ todo: todo }),
    headers: { 'Content-type': 'application/json' },
  })
    .then(() => {
      getData();
    })
    .catch((err) => {
      console.log(err);
    });
});

document.addEventListener('click', (e) => {
  if (e.target.dataset.delete) {
    const id = e.target.dataset.delete;
    return fetch(`/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  if (e.target.dataset.edit) {
    const id = e.target.dataset.edit;
    const newTodo = prompt('New value?');
    if (newTodo.length) {
      return fetch(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ todo: newTodo }),
        headers: { 'Content-type': 'application/json' },
      })
        .then(() => {
          getData();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
});
