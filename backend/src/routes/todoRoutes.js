const express = require("express");
const {
  createTodo,
  getAllTodos,
  getTodoById,
  deleteTodo,
  updateTodo, 
} = require("../controller/todoController");

const router = express.Router();

router.post("/", createTodo);
router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

module.exports = router;
