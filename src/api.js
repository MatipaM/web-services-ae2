const API_URL = '/api';

export async function getArticle(url) {
  const response = await fetch(`${API_URL}/article/${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Article not found');
  }
  return response.json();
}

export async function getFeed(url) {
  const response = await fetch(`${API_URL}/feed/${encodeURIComponent(url)}`);
  console.log("encodeURI", (url))
  console.log("response",response)
  if (!response.ok) {
    throw new Error('Feed not found');
  }

  return response.json();
}

export async function getFeeds() {
  const response = await fetch(`${API_URL}/feeds-with-articles`);
  if (!response.ok) {
    throw new Error('Failed to fetch feeds with articles');
  }
  return response.json();
}

export async function getSubscribedFeeds(email) {
  const response = await fetch(`${API_URL}/subscribed-feeds-with-articles?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch subscribed feeds with articles');
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

// turn into one generic function
export async function saveArticle({ email, article_name, url }) {
  const response = await fetch(`${API_URL}/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, article_name, url }),
  });
  if (!response.ok) {
    throw new Error('Failed to save article');
  }
  return response.json();
}

export async function saveFeed(email, feed_name, url) {
  const response = await fetch(`${API_URL}/feed`, {
<<<<<<< HEAD
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, feed_name, url }),
=======
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, feed_name, url })
>>>>>>> 51a4776 (feed)
  });

  if (!response.ok) {
<<<<<<< HEAD
      throw new Error('Failed to save feed');
=======
    throw new Error('Failed to save feed');
>>>>>>> 51a4776 (feed)
  }
  return response.json();
}


export async function unsaveFeed(email, url) {
  const response = await fetch(`${API_URL}/feed`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, url }),
  });
  if (!response.ok) {
    throw new Error('Failed to unsave feed');
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

export async function isFeedSaved(email, url) {
  const response = await fetch(`${API_URL}/subscribedfeeds/saved?email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Failed to check feed status');
  }
  return response.json();
}