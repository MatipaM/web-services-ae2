<script>
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { getAllArticles } from '../database.js';
    import './Home.css';

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

<h1>Welcome to the Feed Reader</h1>

{#if error}
    <p>Error: {error}</p>
{:else}
    {#if articles.length > 0}
        <div class="article-container">
            {#each articles as article}
                <div class="article-box">
                    <Link class="article-link" to={`/article/${encodeURIComponent(article.url)}`}>
                        {article.article_name}
                    </Link>
                </div>
            {/each}
        </div>
    {:else}
        <p>No articles available.</p>
    {/if}
{/if}
