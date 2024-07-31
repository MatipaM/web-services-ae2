import axios from 'axios';
import cheerio from 'cheerio';

export async function getArticle(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const article_name = $('h1').first().text().trim();
    const author = $('.byline__name').first().text().trim();
    const published_date = $('time').attr('datetime');
    const content = $('.article__body-content').html();

    return {
      article_name,
      url,
      author,
      published_date,
      content
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article');
  }
}


const API_URL = '/api';


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
