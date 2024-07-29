<<<<<<< HEAD
const API_URL = 'http://localhost:3000';
import sqlite3 from 'sqlite3';
=======
const API_URL = '/api';
>>>>>>> b471c75 ('updates')

export async function getArticle(url) {
  const response = await fetch(`${API_URL}/article/${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Article not found');
  }
  return response.json();
}

export async function getAllArticles() {
  const response = await fetch(`${API_URL}/articles`);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
}

export async function saveArticle(email, articleName, url) {
  const response = await fetch(`${API_URL}/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, article_name: articleName, url }),
  });
  if (!response.ok) {
    throw new Error('Failed to save article');
  }
  return response.json();
}

export async function unsaveArticle(email, url) {
  const response = await fetch(`${API_URL}/article`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, url }),
  });
  if (!response.ok) {
    throw new Error('Failed to unsave article');
  }
  return response.json();
}

export async function isArticleSaved(email, url) {
  const response = await fetch(`${API_URL}/article/saved?email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Failed to check article status');
  }
  return response.json();
}


// Create a new database (or open an existing one)
const db = new sqlite3.Database('./database-reader.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database-reader.db SQlite database.');
    // Start creating tables after the connection is successful
    createTables();
  }
});

// Function to create new tables
const createTables = () => {
  const createUser = `
    CREATE TABLE IF NOT EXISTS users (
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      dob TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL PRIMARY KEY, 
      address TEXT NOT NULL
    );
  `;

  const createSavedArticles = `
    CREATE TABLE IF NOT EXISTS savedArticles (
      article_name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      FOREIGN KEY (email) REFERENCES users(email),
      PRIMARY KEY (url)
    );
  `;

  // Keeps list of feeds user has subscribed to 
  const createSubscribedFeeds = ` 
    CREATE TABLE IF NOT EXISTS subscribedFeeds (
      feed_link TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      FOREIGN KEY (email) REFERENCES users(email),
      PRIMARY KEY (feed_link)
    );
  `;

  // Ensure sequential execution of SQL commands
  db.serialize(() => {
    // Create users table
    db.run(createUser, (err) => {
      if (err) {
        console.error('Error creating "users" table:', err.message);
      } else {
        console.log('Table "users" created successfully.');

        // Create savedArticles table
        db.run(createSavedArticles, (err) => {
          if (err) {
            console.error('Error creating "savedArticles" table:', err.message);
          } else {
            console.log('Table "savedArticles" created successfully.');

            // Create subscribedFeeds table
            db.run(createSubscribedFeeds, (err) => {
              if (err) {
                console.error('Error creating "subscribedFeeds" table:', err.message);
              } else {
                console.log('Table "subscribedFeeds" created successfully.');

                // Close the database connection after all operations are complete
                db.close((err) => {
                  if (err) {
                    console.error('Error closing the database:', err.message);
                  } else {
                    console.log('Database connection closed.');
                  }
                });
              }
            }); // end of createSubscribedFeeds
          }
        }); // end of createSavedArticles
      }
    }); // end of createUser
  });
};

