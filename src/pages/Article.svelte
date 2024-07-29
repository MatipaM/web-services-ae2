<script>
    import { onMount } from "svelte";
    import { getArticle, saveArticle, isArticleSaved } from "../api.js";
    import { userEmail } from "../stores/auth.js";

    export let url = "";

    let article = null;
    let error = null;
    let loading = true;
    let isSaved = false;

    $: currentUserEmail = $userEmail;

    async function checkIfSaved() {
        try {
            const result = await isArticleSaved(currentUserEmail, article.url);
            isSaved = result.isSaved;
        } catch (e) {
            console.error("Error checking if article is saved:", e);
        }
    }

    onMount(async () => {
        try {
            article = await getArticle(decodeURIComponent(url));
            if (currentUserEmail) {
                const result = await isArticleSaved(
                    currentUserEmail,
                    article.url,
                );
                isSaved = result.isSaved;
            }
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function handleSave() {
        if (!currentUserEmail) {
            alert("Please log in to save articles");
            return;
        }
        try {
            await saveArticle({
                email: currentUserEmail,
                article_name: article.article_name,
                url: article.url,
            });
            isSaved = true;
            alert("Article saved successfully!");
        } catch (e) {
            alert("Error saving article: " + e.message);
        }
    }
</script>

{#if loading}
    <p>Loading article...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if article}
    <h1>{article.article_name}</h1>
    <p>
        URL: <a href={article.url} target="_blank" rel="noopener noreferrer"
            >{article.url}</a
        >
    </p>
    {#if article.author}
        <p>Author: {article.author}</p>
    {/if}
    {#if article.published_date}
        <p>
            Published: {new Date(article.published_date).toLocaleDateString()}
        </p>
    {/if}
    <button on:click={handleSave}>
        {isSaved ? "Unsave Article" : "Save Article"}
    </button>
    <div class="article-content">
        {@html article.content}
    </div>
{:else}
    <p>No article found</p>
{/if}
