const API_URL = 'http://localhost:3000';

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
  try {
    await getArticle(url);
    return true;
  } catch {
    return false;
  }
}
