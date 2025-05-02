const Todo = require('../model/todo');
const mongoose = require('mongoose');

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description = '', date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Validate date: Reject if date is in the past
    if (!date || new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Please enter a valid date (today or future).' });
    }

    const newTodo = new Todo({
      title,
      description,
      date,
      status: 'incomplete',
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a todo by ID
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a todo by ID
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const allowedStatuses = ['incomplete', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (date && new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Please enter a valid future date.' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, date, status },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
