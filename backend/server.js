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

    // Check if the users table is empty, and insert initial data if it is
    db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
        if (err) {
            console.error('Error counting users', err);
            return;
        }

        if (row.count === 0) {
            const usersData = [
                ['John', 'Doe', '1980-01-01', 'john.doe@example.com', '123 Elm Street'],
                ['Jane', 'Smith', '1990-02-02', 'jane.smith@example.com', '456 Oak Avenue'],
                ['Alice', 'Johnson', '1985-03-03', 'alice.johnson@example.com', '789 Pine Road'],
            ];

            const insertUserStmt = db.prepare('INSERT INTO users (firstname, lastname, dob, email, address) VALUES (?, ?, ?, ?, ?)');
            usersData.forEach(user => {
                insertUserStmt.run(user, err => {
                    if (err) {
                        console.error('Error inserting user', err);
                    }
                });
            });
            insertUserStmt.finalize();

            console.log('Sample users data inserted.');
        }
    });

    // Check if the savedArticles table is empty, and insert initial data if it is
    db.get('SELECT COUNT(*) AS count FROM savedArticles', (err, row) => {
        if (err) {
            console.error('Error counting savedArticles', err);
            return;
        }

        if (row.count === 0) {
            const articlesData = [
                ['First Article', 'http://example.com/first', 'john.doe@example.com'],
                ['Second Article', 'http://example.com/second', 'jane.smith@example.com'],
                ['Third Article', 'http://example.com/third', 'alice.johnson@example.com'],
            ];

            const insertArticleStmt = db.prepare('INSERT INTO savedArticles (article_name, url, email) VALUES (?, ?, ?)');
            articlesData.forEach(article => {
                insertArticleStmt.run(article, err => {
                    if (err) {
                        console.error('Error inserting article', err);
                    }
                });
            });
            insertArticleStmt.finalize();

            console.log('Sample articles data inserted.');
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
