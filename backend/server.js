const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');


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

    db.run(`CREATE TABLE IF NOT EXISTS users (
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        dob TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL PRIMARY KEY, 
        address TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS savedArticles (
        article_name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        FOREIGN KEY (email) REFERENCES users(email),
        PRIMARY KEY (url)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS feeds (
        feed_name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        PRIMARY KEY (url)
    )`);

    console.log('Tables created successfully.');

    // const passwordHash = bcrypt.hashSync('12345', 5); 
    const mockUser = ['Matipa', 'Matipa', '1990-01-01', 'matipa@gmail.com', 'Happy Street', 'matipa', '12345'];
    db.run('INSERT OR REPLACE INTO users (firstname, lastname, dob, email, address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)', mockUser, (err) => {
        if (err) {
            console.error('Error inserting mock user', err);
        } else {
            console.log('Mock user inserted successfully.');
        }
    });

    // Insert the BBC articles
    const bbcArticle = ['BBC Olympics Article', 'https://www.bbc.co.uk/sport/olympics/articles/cw4yepmknkpo', 'john@gmail.com'];
    const bbcArticle2 = ['BBC Politics Article', 'https://www.bbc.co.uk/news/articles/cmj260e54x7o', 'john@gmail.com'];

    db.run('INSERT OR REPLACE INTO savedArticles (article_name, url, email) VALUES (?, ?, ?)', bbcArticle,  (err) => {
        if (err) {
            console.error('Error inserting BBC Olympics article', err);
        } else {
            console.log('BBC Olympics article inserted successfully.');
        }
    });

    db.run('INSERT OR REPLACE INTO savedArticles (article_name, url, email) VALUES (?, ?, ?)', bbcArticle2,  (err) => {
        if (err) {
            console.error('Error inserting BBC Politics article', err);
        } else {
            console.log('BBC Politics article inserted successfully.');
        }
    });

    // General Feeds, which will be shown on the home page
    const bbc = ['BBC', 'http://feeds.bbci.co.uk/news/rss.xml'];
    const cnn = ['CNN', 'http://rss.cnn.com/rss/cnn_topstories.rss'];
    const nytimes = ['NyTimes','https://rss.nytimes.com/services/xml/rss/nyt/World.xml'];

    const feeds = [bbc, cnn, nytimes];

    for (let idx = 0; idx < feeds.length; idx++) {
        db.run('INSERT OR REPLACE INTO feeds (feed_name, url) VALUES (?, ?)', feeds[idx], (err) => {
            if (err) {
                console.error(`Error inserting ${feeds[idx][0]} feed`, err);
            } else {
                console.log(`${feeds[idx][0]} feed inserted successfully.`);
            }
        });
    }

});

// API endpoints
app.get('/feeds-with-articles', (req, res) => {
    db.all('SELECT * FROM feeds', (err, feeds) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const feedPromises = feeds.map(feed => {
            return new Promise((resolve, reject) => {
                db.all('SELECT article_name, url FROM savedArticles WHERE url LIKE ? LIMIT 5', [`${feed.url}%`], (err, articles) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...feed,
                            articles: articles
                        });
                    }
                });
            });
        });

        Promise.all(feedPromises)
            .then(feedsWithArticles => {
                res.json(feedsWithArticles);
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
});

app.get('/subscribed-feeds-with-articles', (req, res) => {
    db.all('SELECT * FROM feeds', (err, feeds) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const feedPromises = feeds.map(feed => {
            return new Promise((resolve, reject) => {
                db.all('SELECT article_name, url FROM savedArticles WHERE url LIKE ? LIMIT 5', [`${feed.url}%`], (err, articles) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...feed,
                            articles: articles
                        });
                    }
                });
            });
        });

        Promise.all(feedPromises)
            .then(feedsWithArticles => {
                res.json(feedsWithArticles);
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
});

app.get('/articles', (req, res) => {
    db.all('SELECT * FROM savedArticles', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/feed/:url', (req, res) => {
    const decodedUrl = decodeURIComponent(req.params.url);
    db.get('SELECT * FROM feeds WHERE url = ?', [decodedUrl], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Feed not found' });
        }
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

app.get('/article/saved', (req, res) => {
    const { email, url } = req.query;
    db.get('SELECT * FROM savedArticles WHERE email = ? AND url = ?', [email, url], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ isSaved: !!row });
    });
});

app.get('/user/:email', (req, res) => {
    db.get('SELECT * FROM users WHERE email = ?', [req.params.email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // if (user && bcrypt.compareSync(password, user.password)) {
        if (user && password) {
            res.json({ success: true, message: 'Login successful', user });
        } else {
            console.log(username, password)
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});


app.post('/register', (req, res) => {
    const {username, firstname, lastname, dob, email, address, password} = req.body;
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error hashing password' });
        }

        db.run('INSERT INTO users (username, firstname, lastname, dob, email, address, password) VALUES (?,?,?,?,?,?,?)', 
            [username, firstname, lastname, dob, email, address, hash], 
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ success: false, message: 'Username or email already exists' });
                    }
                    return res.status(500).json({ success: false, message: 'Error registering user' });
                }
                res.json({ success: true, message: 'User registered successfully' });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
