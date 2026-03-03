const path = require("path");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 5000;
const MONGO_URL = "mongodb://127.0.0.1:27017";

let db;

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connect
MongoClient.connect(MONGO_URL)
  .then(client => {
    db = client.db("todoDB");
    console.log("MongoDB connected");
  })
  .catch(err => console.error(err));

app.use(express.static(path.join(__dirname, "../frontend")));
// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// GET todos
app.get("/todos", async (req, res) => {
  const todos = await db.collection("todos").find().toArray();
  res.json(todos);
});

// POST todo
app.post("/todos", async (req, res) => {
  const todo = {
    title: req.body.title,
    completed: false
  };
  const result = await db.collection("todos").insertOne(todo);
  res.json(result);
});

// PUT todo
app.put("/todos/:id", async (req, res) => {
  await db.collection("todos").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json({ message: "Todo updated" });
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  await db.collection("todos").deleteOne({
    _id: new ObjectId(req.params.id)
  });
  res.json({ message: "Todo deleted" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});