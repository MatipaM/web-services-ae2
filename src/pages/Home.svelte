<script>
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { getFeeds, getSubscribedFeeds, saveFeed } from '../api.js';
    import { isAuthenticated, userEmail } from '../stores/auth.js';
    import './Home.css';

    let feedsWithArticles = [];
    let error = null;

    $: isLoggedIn = $isAuthenticated;
    $: email = $userEmail;

    onMount(async () => {
        try {
            if (isLoggedIn) {
                feedsWithArticles = await getSubscribedFeeds(email);  
            } else {
                feedsWithArticles = await getFeeds();  
            }

            console.log('Fetched feeds:', feedsWithArticles); // Log fetched feeds
        } catch (err) {
            error = err.message;
        }
    });

    async function handleSubscribe(feed) {
        if (!email) { 
            alert("Please log in to subscribe to feeds");
            return;
        }

        console.log("Payload being sent:", { email, feed_name: feed.feed_name, url: feed.url }); // Log payload

        try {
            await saveFeed(email, feed.feed_name, feed.url); 
            alert("Feed saved successfully!");
        } catch (e) {
            alert("Error saving feed: " + e.message);
        }
    }
</script>

<h1>Welcome to the Feed Reader</h1>

{#if isLoggedIn}
    <p>Welcome, {email}</p>
{:else}
    <p>Please log in to view your feeds.</p>
{/if}

{#if error}
    <p>Error: {error}</p>
{:else}
    {#if feedsWithArticles.length > 0}
        <div class="feeds-container">
            {#each feedsWithArticles as feed}
                <div class="feed-box">
                    <h2>{feed.feed_name}</h2> <!-- Ensure feed_name is displayed correctly -->
                    <Link class="feed-link" to={`/feed/${encodeURIComponent(feed.url)}`}>
                        View Full Feed
                    </Link>
                    <br/>
                    <button on:click={() => { console.log(feed); handleSubscribe(feed); }}>Save</button> <!-- Log feed before passing -->
                    {#if feed.articles && feed.articles.length > 0}
                        <ul class="article-list">
                            {#each feed.articles.slice(0, 5) as article}
                                <li>
                                    <Link class="article-link" to={`/article/${encodeURIComponent(article.url)}`}>
                                        {article.article_name}
                                    </Link>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p>No articles available for this feed.</p>
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <p>No Feeds available.</p>
    {/if}
{/if}
