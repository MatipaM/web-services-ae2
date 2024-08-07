<script>
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { getAllArticles, getFeeds, getSubscribedFeeds } from '../api.js';
    import { isAuthenticated, userEmail } from '../stores/auth.js';
    import './Home.css';

    let articles = [];
    let error = null;
    let feeds = [];

    $: isLoggedIn = $isAuthenticated;
    $: email = $userEmail;

    onMount(async () => {
        try {
            if (isLoggedIn) {
                feeds = await getSubscribedFeeds(email);  
            } else {
                feeds = await getFeeds();  
            }
             articles = await getAllArticles(); 
        } catch (err) {
            error = err.message;
        }
    });
</script>

<h1>Welcome to the Feed Reader</h1>

{#if isLoggedIn}
    <p>Welcome, {email}</p>
{:else}
    <p>Please log in to view your feeds.</p>
{/if}

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
{#if error}
    <p>Error: {error}</p>
{:else}
    {#if feeds.length > 0}
        <div class="article-container">
            {#each feeds as feed}
                <div class="article-box">
                    <Link class="article-link" to={`/feed/${encodeURIComponent(feed.url)}`}>
                        {feed.feed_name}
                    </Link>
                </div>
            {/each}
        </div>
    {:else}
        <p>No Feeds available.</p>
    {/if}
{/if}
