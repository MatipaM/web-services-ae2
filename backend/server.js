const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database-reader.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the database-reader.db database.');
    }
});

db.serialize(() => {

    db.each("SELECT * FROM savedArticles", (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row);
    });

    db.run(`CREATE TABLE IF NOT EXISTS users (
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    dob TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL PRIMARY KEY, 
    address TEXT NOT NULL
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS savedArticles (
    article_name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email),
    PRIMARY KEY (url)
  )`);

    console.log('Tables created successfully.');

    // Insert the BBC article
    const bbcArticle = ['BBC Olympics Article', 'https://www.bbc.co.uk/sport/olympics/articles/cw4yepmknkpo', 'john.doe@example.com'];

    db.run('INSERT OR REPLACE INTO savedArticles (article_name, url, email) VALUES (?, ?, ?)', bbcArticle, (err) => {
        if (err) {
            console.error('Error inserting BBC article', err);
        } else {
            console.log('BBC article inserted successfully.');
        }
    });
});

// API endpoints
app.get('/articles', (req, res) => {
    db.all('SELECT * FROM savedArticles', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/article/:url', (req, res) => {
    const decodedUrl = decodeURIComponent(req.params.url);
    db.get('SELECT * FROM savedArticles WHERE url = ?', [decodedUrl], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    });
});

app.post('/article', (req, res) => {
    const { email, article_name, url } = req.body;
    db.run('INSERT OR REPLACE INTO savedArticles (email, article_name, url) VALUES (?, ?, ?)',
        [email, article_name, url],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.delete('/article', (req, res) => {
    const { email, url } = req.body;
    db.run('DELETE FROM savedArticles WHERE email = ? AND url = ?',
        [email, url],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ changes: this.changes });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
