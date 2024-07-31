<script>
    import { onMount } from "svelte";
    import { getArticle, saveArticle, isArticleSaved } from "../api.js";
    import { userEmail } from "../stores/auth.js";

    export let url = "";

    let feeds = null;
    let error = null;
    let loading = true;
    let isSaved = false;

    onMount(async () => {
        try {
            feeds = await getArticle(decodeURIComponent(url));
  
                const result = await isArticleSaved(
                    feeds.name,
                    feeds.url,
                );
            
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

        // NEED TO WOKR ON THIS
    async function handleSubscribed() {
    //     if (!currentUserEmail) {
    //         alert("Please log in to save articles");
    //         return;
    //     }
    //     try {
    //         await saveArticle({
    //             email: currentUserEmail,
    //             article_name: article.article_name,
    //             url: article.url,
    //         });
    //         isSaved = true;
    //         alert("Article saved successfully!");
    //     } catch (e) {
    //         alert("Error saving article: " + e.message);
    //     }
    }
</script>

{#if loading}
    <p>Loading article...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if feeds}
    <h1>{feeds.name}</h1>
    <p>
        URL: <a href={feeds.url} target="_blank" rel="noopener noreferrer"
            >{feeds.url}</a
        >
    </p>

    <button on:click={handleSubscribed}>
        {isSaved ? "Unsubscribed to feed" : "Subscribed to feed"}
    </button>
{:else}
    <p>No Feeds found</p>
{/if}
