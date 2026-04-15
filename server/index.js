const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const db = new Database("docs.db");

// Tables
db.exec(`
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
);

CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  docId INTEGER,
  email TEXT
);
`);

// SAVE
app.post("/save", (req, res) => {
  const { content } = req.body;

  const stmt = db.prepare("INSERT INTO documents (content) VALUES (?)");
  const result = stmt.run(content);

  res.json({ id: result.lastInsertRowid });
});

// GET DOC
app.get("/doc/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM documents WHERE id = ?")
    .get(req.params.id);

  res.json(row);
});

// SHARE
app.post("/share", (req, res) => {
  const { docId, email } = req.body;

  const stmt = db.prepare(
    "INSERT INTO shares (docId, email) VALUES (?, ?)"
  );
  stmt.run(docId, email);

  res.json({ message: "Shared successfully" });
});

// GET SHARED
app.get("/shared/:email", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM shares WHERE email = ?")
    .all(req.params.email);

  res.json(rows);
});

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});