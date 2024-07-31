<script>
    import { onMount } from 'svelte';
    import { getAllArticles } from '../api.js';
    
    let articles = [];
    let error = null;
  
    onMount(async () => {
      try {
        articles = await getAllArticles();
      } catch (err) {
        error = err.message;
      }
    });
  </script>
  
  {#if error}
    <p>Error: {error}</p>
  {:else}
    <ul>
      {#each articles as article}
        <li>{article.article_name} - <a href="{article.url}">{article.url}</a></li>
      {/each}
    </ul>
  {/if}
  