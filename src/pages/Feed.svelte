<script>
    import { onMount } from "svelte";
    import { getFeed, saveFeed, isArticleSaved, isFeedSaved } from "../api.js";
    import { userEmail } from "../stores/auth.js"; 
    import {RSSParser} from "../RSSParser.js"; 

    export let url = "";

    let feed = null;
    let error = null;
    let loading = true;
    let isSaved = false;
    let dictionary = {}

    $: currentUserEmail = $userEmail;

    onMount(async () => {
         console.log("is running")
        try {
            feed = await getFeed(decodeURIComponent(url));

            const parser = new RSSParser(feed.name);
            dictionary = await parser.displayArticle();
            // parser.displayFeed();

        } catch (e) {
            console.log(e)
        } finally {
            loading = false;
        }
    });

    async function handleSubscribe() {
        if (!currentUserEmail) {
            alert("Please log in to subscribe to feeds");
            return;
        }
        try {
            await saveFeed({
                feed_name: feed.feed_name,
                url: feed.url,
            });
            isSaved = true;
            alert("Article saved successfully!");
        } catch (e) {
            alert("Error saving article: " + e.message);
        }
    }
</script>

{#if loading}
    <p>Loading feed...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if dictionary!={}}
    <h1>{feed.feed_name}</h1>
    <p>
        URL: <a href={feed.url} target="_blank" rel="noopener noreferrer"
            >{feed.url}</a
        >
    </p>

    <ul>
        {#each Object.entries(dictionary) as [key, value]}
            <p class='feed-box'>
                <strong>{key}</strong>: {value}
            <p>
        {/each}
    </ul>
    

    <button on:click={handleSubscribe}>
        {isSaved ? "Unsubscribe to feed" : "Subscribe to feed"}
    </button>

{:else}
    <p>No feed found</p>
{/if}

