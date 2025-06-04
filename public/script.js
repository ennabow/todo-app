document.addEventListener('DOMContentLoaded', () => {
  const todoTitle = document.getElementById('todoTitle');
  const todoDesc = document.getElementById('todoDesc');
  const addTodoBtn = document.getElementById('addTodo');
  const todosList = document.querySelector('.todo-list');

  // Load Todos on page load
  loadTodos();

  // Add new Todo
  addTodoBtn.addEventListener('click', async () => {
    const title = todoTitle.value.trim();
    const description = todoDesc.value.trim();

    if (!title) {
      alert('Todo title is required!');
      return;
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        todoTitle.value = '';
        todoDesc.value = '';
        loadTodos();
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error('Error adding Todo:', err);
      alert('Failed to add Todo');
    }
  });

  // Load Todos from API
  async function loadTodos() {
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      renderTodos(todos);
    } catch (err) {
      console.error('Error loading Todos:', err);
    }
  }

  // Render Todos to the page
  function renderTodos(todos) {
    todosList.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';

      li.innerHTML = `
        <div>
          <h3>${todo.title}</h3>
          <p>${todo.description || 'No description'}</p>
        </div>
        <div>
          <button data-id="${todo.id}" class="delete-btn">Delete</button>
        </div>
      `;

      todosList.appendChild(li);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTodo);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteTodo);
    });
  }

  // Toggle Todo completion status
  async function toggleTodo(e) {
    const todoId = e.target.getAttribute('data-id');

    try {
      const todo = await (await fetch(`/api/todos/${todoId}`)).json();
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        loadTodos();
      }
    } catch (err) {
      console.error('Error toggling Todo:', err);
    }
  }

  // Delete a Todo
  async function deleteTodo(e) {
    const todoId = e.target.getAttribute('data-id');

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadTodos();
      }
    } catch (err) {
      console.error('Error deleting Todo:', err);
    }
  }
});