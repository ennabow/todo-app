const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');


const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// GET all todo
router.get('/', asyncHandler(async (req, res) => {
  const data = await Todo.getAll();
  res.json(data);
}));

// GET a specific todo
router.get('/:id', asyncHandler((req, res) => {
  const todo = Todo.getById(req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send('todo not found');
  }
}));

// POST a new todo
router.post('/', asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const validate = () => {
    if (!title || !description) {
      return false;
    } else if (title.length == 0 || description.length == 0){
      return false;
    } else if (typeof title !== 'string' || typeof description !== 'string') {
      return false
    } else return true
  }
  const isValidParams = validate();

  if (isValidParams) {
    const newTodo = await Todo.create(title, description);
    const content = JSON.stringify(newTodo);
    res.status(201)
    res.send(content);
  } else {
    console.log('try add incorrect record params', { title, description })
    return res.status(400).send('Title and description is required');
  }
  
}));

// PUT update a todo
router.put('/:id', asyncHandler(async (req, res) => {
  const { title, description, completed } = req.body;
  const updatedTodo = Todo.update(req.params.id, { title, description, completed });
  if (updatedTodo) {
    res.json(updatedTodo);
  } else {
    res.status(404).send('todo not found');
  }
}));

// DELETE a todo
router.delete('/:id', asyncHandler((req, res) => {
  const success = Todo.delete(req.params.id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send('todo not found');
  }
}));

module.exports = router;