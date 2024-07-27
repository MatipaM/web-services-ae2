import initSqlJs from 'sql.js';

let db;
let SQL;

async function initDb() {
  SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  db = new SQL.Database();
  createTables();
}

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

  db.run(createUser);
  db.run(createSavedArticles);
  console.log('Tables created successfully.');
}

export async function getArticle(url) {
  await ensureDbInitialized();
  const stmt = db.prepare('SELECT * FROM savedArticles WHERE url = :url');
  const result = stmt.getAsObject({':url': url});
  stmt.free();
  if (Object.keys(result).length === 0) {
    throw new Error('Article not found');
  }
  return result;
}

export async function saveArticle(email, articleName, url) {
  await ensureDbInitialized();
  const stmt = db.prepare('INSERT INTO savedArticles (email, article_name, url) VALUES (:email, :article_name, :url)');
  stmt.run({':email': email, ':article_name': articleName, ':url': url});
  stmt.free();
}

export async function unsaveArticle(email, url) {
  await ensureDbInitialized();
  const stmt = db.prepare('DELETE FROM savedArticles WHERE email = :email AND url = :url');
  stmt.run({':email': email, ':url': url});
  stmt.free();
}

export async function isArticleSaved(email, url) {
  await ensureDbInitialized();
  const stmt = db.prepare('SELECT * FROM savedArticles WHERE email = :email AND url = :url');
  const result = stmt.get({':email': email, ':url': url});
  stmt.free();
  return !!result;
}

async function ensureDbInitialized() {
  if (!db) {
    await initDb();
  }
}

// Initialize the database
initDb().catch(console.error);

export { db };