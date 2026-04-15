const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const Database = require("better-sqlite3");
const db = new Database("docs.db");

db.run(`
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  docId INTEGER,
  email TEXT
)
`);

app.post("/save", (req, res) => {
  const { content } = req.body;
  db.run("INSERT INTO documents (content) VALUES (?)", [content], function () {
    res.json({ id: this.lastID });
  });
});

app.get("/doc/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    res.json(row);
  });
});

app.post("/share", (req, res) => {
  console.log("SHARE API HIT");

  const { docId, email } = req.body;

  db.run(
    "INSERT INTO shares (docId, email) VALUES (?, ?)",
    [docId, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Shared successfully" });
    }
  );
});

app.get("/shared/:email", (req, res) => {
  db.all("SELECT * FROM shares WHERE email = ?", [req.params.email], (err, rows) => {
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});