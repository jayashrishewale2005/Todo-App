const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// ADD todo
router.post("/add", async (req, res) => {
  const todo = new Todo({
    title: req.body.title
  });
  await todo.save();
  res.json(todo);
});

// GET all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// UPDATE todo
router.put("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(todo);
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo Deleted" });
});

module.exports = router;