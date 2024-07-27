<script>
    import { onMount } from 'svelte';
    import { getArticle, saveArticle, unsaveArticle, isArticleSaved } from '../database.js';
    import { user } from '../stores/auth.js';
  
    export let url;
  
    let article = null;
    let isLoading = true;
    let isSaved = false;
  
    onMount(async () => {
      try {
        article = await getArticle(decodeURIComponent(url));
        isLoading = false;
        if ($user) {
          isSaved = await isArticleSaved($user.email, url);
        }
      } catch (error) {
        console.error('Error loading article:', error);
        isLoading = false;
      }
    });
  
    async function toggleSave() {
      if (!$user) {
        alert('Please log in to save articles');
        return;
      }
      try {
        if (isSaved) {
          await unsaveArticle($user.email, url);
        } else {
          await saveArticle($user.email, article.article_name, url);
        }
        isSaved = !isSaved;
      } catch (error) {
        console.error('Error toggling save:', error);
      }
    }
  </script>
  
  <svelte:head>
    <title>{article ? article.article_name : 'Loading Article...'}</title>
  </svelte:head>
  
  <div class="article-page">
    {#if isLoading}
      <p>Loading article...</p>
    {:else if article}
      <h1>{article.article_name}</h1>
      
      <button on:click={toggleSave}>
        {isSaved ? 'Unsave Article' : 'Save Article'}
      </button>
  
      <div class="content">
        <p>URL: <a href={article.url} target="_blank" rel="noopener noreferrer">{article.url}</a></p>
      </div>
    {:else}
      <p>Article not found.</p>
    {/if}
  </div>
  
  <style>
    .article-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
  
    h1 {
      font-size: 2em;
      margin-bottom: 10px;
    }
  
    .content {
      margin-top: 20px;
      line-height: 1.6;
    }
  
    button {
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #45a049;
    }
  </style>