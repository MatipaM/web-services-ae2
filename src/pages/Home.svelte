<script>
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { getAllArticles, getFeeds } from '../api.js';
    import './Home.css';

    let articles = [];
    let error = null;
    let feeds = [];

    onMount(async () => {
        try {
            feeds = await getFeeds();
            console.log(feeds)
            // articles = await getAllArticles(); 
        } catch (err) {
            error = err.message;
        }
    });
</script>

<h1>Welcome to the Feed Reader</h1>
<!-- if user logged in, show subscribed feeds instead -->
{#if error}
    <p>Error: {error}</p>
{:else}
    {#if feeds.length > 0}
        <div class="article-container">
            {#each feeds as feed}
                <div class="article-box">
                    <!-- <Link class="article-link" to={`/feeds/${encodeURIComponent(feed.url)}`}>  to={`/feeds/${encodeURIComponent(feed.url)}`} -->
                    <Link class="article-link" to={feed.url}> 
                        {feed.feed_name}
                    </Link>
                </div>
            {/each}
        </div>
    {:else}
        <p>No Feeds available.</p>
    {/if}
{/if}
