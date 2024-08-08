<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { getSubscribedFeeds, unsaveFeed } from "../api.js";
    import { userEmail } from "../stores/auth.js"; 

    let subscribedFeeds = [];
    let error = null;
    let loading = true;

    $: currentUserEmail = $userEmail;

    onMount(async () => {
        if (currentUserEmail) {
            await loadSubscribedFeeds();
        } else {
            loading = false;
        }
    });

    $: if (currentUserEmail) {
        loadSubscribedFeeds();
    }

    async function loadSubscribedFeeds() {
        loading = true;
        try {
            subscribedFeeds = await getSubscribedFeeds(currentUserEmail);
        } catch (e) {
            console.error("Error fetching subscribed feeds:", e);
            error = e.message;
        } finally {
            loading = false;
        }
    }

    async function handleUnsubscribe(feed) {
        try {
            await unsaveFeed(currentUserEmail, feed.url);
            await loadSubscribedFeeds(); // Reload the feeds after unsubscribing
            alert("Unsubscribed from feed successfully!");
        } catch (e) {
            alert("Error unsubscribing from feed: " + e.message);
        }
    }
</script>

<h1>Your Subscribed Feeds</h1>

{#if loading}
    <p>Loading your subscribed feeds...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if currentUserEmail === undefined}
    <p>Please sign in to see your subscribed feeds</p>
{:else if subscribedFeeds.length > 0}
    <div class="feeds-container">
        {#each subscribedFeeds as feed (feed.url)}
            <div class="feed-box">
                <h2>{feed.feed_name}</h2>
                <p>
                    URL: <a href={feed.url} target="_blank" rel="noopener noreferrer">{feed.url}</a>
                </p>
                <button on:click={() => handleUnsubscribe(feed)}>
                    Unsubscribe from feed
                </button>
                {#if feed.articles && feed.articles.length > 0}
                    <h3>Latest Articles:</h3>
                    <ul>
                        {#each feed.articles.slice(0, 5) as article}
                            <li>
                                <Link to={`/article/${encodeURIComponent(article.url)}`}>
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
    <p>You haven't subscribed to any feeds yet.</p>
{/if}