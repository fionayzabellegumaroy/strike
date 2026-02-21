const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Create/Open database
const db = new Database("school.db");

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade INTEGER
  )
`).run();

// API Route - Get all students
app.get("/students", (req, res) => {
  const students = db.prepare("SELECT * FROM students").all();
  res.json(students);
});

// API Route - Add student
app.post("/students", (req, res) => {
  const { name, grade } = req.body;

  db.prepare(`
    INSERT INTO students (name, grade)
    VALUES (?, ?)
  `).run(name, grade);

  res.json({ message: "Student added!" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});