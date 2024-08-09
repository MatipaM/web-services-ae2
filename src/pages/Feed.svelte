<script>
    import { onMount } from "svelte";
    import { getFeed, saveFeed, unsaveFeed, isFeedSaved, saveArticle } from "../api.js";
    import { userEmail } from "../stores/auth.js"; 
    import {RSSParser} from "../rssParser.js"; 

    export let url = "";

    let feed = null;
    let error = null;
    let loading = true;
    let isSaved = false;
    let dictionary = {}

    $: currentUserEmail = $userEmail;

    async function checkSavedStatus() {
        if (currentUserEmail && feed) {
            try {
                // const result = await isFeedSaved(currentUserEmail, feed.url);
                feed = await getFeed(decodeURIComponent(url));
                console.log("feed", feed);

                const parser = new RSSParser(feed.name);
                dictionary = await parser.displayArticle();
            // parser.displayFeed();
                isSaved = feed.isSaved;
            } catch (e) {
                console.error("Error checking feed saved status:", e);
            }
        }
    }

    onMount(async () => {
        try {
            feed = await getFeed(decodeURIComponent(url));
            console.log("feed", feed);
            await checkSavedStatus();
        } catch (e) {
            console.error(e);
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function handleSubscribe(title, description) {
        if (!currentUserEmail) {
            alert("Please log in to subscribe to feeds");
            return;
        }
        try {
            await saveArticle({
                email: currentUserEmail,
                article_name: `${title}: ${description}`,
                url: feed.url,
            });
            isSaved = true;
            alert("Article saved successfully!");
        } catch (e) {
            alert("Error saving article: " + e.message +title+description);
            if (isSaved) {
                await unsaveFeed(currentUserEmail, feed.url);
                isSaved = false;
                alert("Unsubscribed from feed successfully!");
            } else {
                await saveFeed(currentUserEmail, feed.feed_name, feed.url);
                isSaved = true;
                alert("Subscribed to feed successfully!");
            }
        } 
        // catch (e) {
        //     alert("Error " + (isSaved ? "unsubscribing from" : "subscribing to") + " feed: " + e.message);
        // }
    }
</script>

{#if loading}
    <p>Loading feed...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if dictionary!={}}
    <h1>{feed.feed_name}</h1>
    <p>
        URL: <a href={feed.url} target="_blank" rel="noopener noreferrer">{feed.url}</a>
    </p>

    <ul>
        {#each Object.entries(dictionary) as [key, value]}
            <p class='feed-box'>
                <strong>{key}</strong>: {value}
                <button on:click={() => handleSubscribe(key, value)}>Save</button>
            <p>
                
        {/each}
    </ul>
    

    <!-- <button on:click={handleSubscribe}>
        {isSaved ? "Unsubscribe to feed" : "Subscribe to feed"}
    </button> -->

    <button on:click={handleSubscribe}>
        {isSaved ? "Unsubscribe from feed" : "Subscribe to feed"}
    </button>

{:else}
    <p>No feed found</p>
{/if}
