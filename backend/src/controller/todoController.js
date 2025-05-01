const Todo = require('../model/todo');

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // Validate date: Reject if date is in the past
    if (new Date(date) < new Date()) {
      return res.status(400).json({ 
        message: "Please enter a valid date (today or future)." 
      });
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
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update a todo by ID
const updateTodo = async (req, res) => {
  try {
    const { title, description, date, status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, date, status },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }

};
// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
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
  deleteTodo,
  updateTodo,
};
