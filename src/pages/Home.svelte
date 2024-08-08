<script>
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { getAllArticles, getFeeds, getSubscribedFeeds, saveFeed} from '../api.js';
    import { isAuthenticated, user, userEmail } from '../stores/auth.js';
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
        } catch (err) {
            error = err.message;
        }
    });


    async function handleSubscribe(feed) {
        if (!userEmail) {
            alert("Please log in to subscribe to feeds");
            return;
        }
        try {
            await saveFeed({
                email: userEmail,
                feed_name: feed.feed_name,
                url: feed.url,
            });
            // isSaved = true;
            alert("Article saved successfully!");
        } catch (e) {
            alert("Error saving article: " + e.message);
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
                    <h2>{feed.feed_name}</h2>
                    <Link class="feed-link" to={`/feed/${encodeURIComponent(feed.url)}`}>
                        View Full Feed
                    </Link>
                    <br/>
                    <button on:click={handleSubscribe}>Save</button>
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
