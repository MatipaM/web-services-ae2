import Database from 'better-sqlite3';

const db = new Database('./database-reader.db', { verbose: console.log });

function createTables() {
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

  db.exec(createUser);
  db.exec(createSavedArticles);
  console.log('Tables created successfully.');
}

function insertSampleArticles() {
  const sampleArticles = [
    {
      article_name: "The Future of AI",
      url: "https://example.com/ai-future",
      email: "sample@email.com"
    },
    {
      article_name: "Web Development Trends 2024",
      url: "https://example.com/web-dev-2024",
      email: "sample@email.com"
    },
    {
      article_name: "Introduction to Svelte",
      url: "https://example.com/svelte-intro",
      email: "sample@email.com"
    }
  ];

  const insert = db.prepare('INSERT OR REPLACE INTO savedArticles (article_name, url, email) VALUES (?, ?, ?)');
  const insertMany = db.transaction((articles) => {
    for (const article of articles) insert.run(article.article_name, article.url, article.email);
  });

  insertMany(sampleArticles);
  console.log('Sample articles inserted successfully.');
}

createTables();
insertSampleArticles();

export function getArticle(url) {
  const stmt = db.prepare('SELECT * FROM savedArticles WHERE url = ?');
  const result = stmt.get(url);
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
}

export function getAllArticles() {
  const stmt = db.prepare('SELECT * FROM savedArticles');
  return stmt.all();
}

export function saveArticle(email, articleName, url) {
  const stmt = db.prepare('INSERT OR REPLACE INTO savedArticles (email, article_name, url) VALUES (?, ?, ?)');
  stmt.run(email, articleName, url);
}

export function unsaveArticle(email, url) {
  const stmt = db.prepare('DELETE FROM savedArticles WHERE email = ? AND url = ?');
  stmt.run(email, url);
}

export function isArticleSaved(email, url) {
  const stmt = db.prepare('SELECT * FROM savedArticles WHERE email = ? AND url = ?');
  const result = stmt.get(email, url);
  return !!result;
}

export { db };