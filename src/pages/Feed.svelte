<script>
    import { onMount } from "svelte";
    import { getFeed, saveArticle, isArticleSaved } from "../api.js";
    import { userEmail } from "../stores/auth.js";

    console.log("feed page is called")
    export let url = "";

    let feed = null;
    let error = null;
    let loading = true;
    let isSaved = false;

    // $: currentUserEmail = $userEmail;

    // async function checkIfSaved() {
    //     try {
    //         const result = await isArticleSaved(currentUserEmail, feed.url);
    //         isSaved = result.isSaved;
    //     } catch (e) {
    //         console.error("Error checking if article is saved:", e);
    //     }
    // }

    onMount(async () => {
         console.log("is running")
        try {
            feed = await getFeed(decodeURIComponent(url));
            console.log("feed",feed)
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    // async function handleSave() {
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
    // }
</script>

{#if loading}
    <p>Loading article...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if feed}
    <h1>{feed.feed_name}</h1>
    <p>
        URL: <a href={feed.url} target="_blank" rel="noopener noreferrer"
            >{feed.url}</a
        >
    </p>
    <!-- {#if feed.author}
        <p>Author: {article.author}</p>
    {/if} -->
    <!-- {#if article.published_date}
        <p>
            Published: {new Date(article.published_date).toLocaleDateString()}
        </p>
    {/if} -->
    <!-- <button on:click={handleSave}>
        {isSaved ? "Unsave Article" : "Save Article"}
    </button> -->
    <!-- <div class="article-content">
        {@html article.content}
    </div> -->
{:else}
    <p>No feed found</p>
{/if}
