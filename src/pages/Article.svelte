<script>
    import { onMount } from 'svelte';
    import { getArticle } from '../database.js';

    export let url = '';

    let article = null;
    let error = null;

    onMount(async () => {
        try {
            article = await getArticle(decodeURIComponent(url));
        } catch (e) {
            error = e.message;
        }
    });
</script>

{#if error}
    <p>Error: {error}</p>
{:else if article}
    <h1>{article.article_name}</h1>
    <p>URL: <a href={article.url} target="_blank" rel="noopener noreferrer">{article.url}</a></p>
{:else}
    <p>No article</p>
{/if}

<style>
    h1 {
        color: #333;
    }
    p {
        margin-bottom: 1em;
    }
    a {
        color: #0066cc;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>