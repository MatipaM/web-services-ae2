<script>
    import { onMount } from "svelte";
    import { getAllArticles, unsaveArticle } from "../api.js";
    import { userEmail } from "../stores/auth.js";

    let savedArticles = [];
    let error = null;
    let loading = true;

    $: currentUserEmail = $userEmail;

    onMount(async () => {
        await loadSavedArticles();
    });

    async function loadSavedArticles() {
        try {
            loading = true;
            const articles = await getAllArticles();
            savedArticles = articles.filter(article => article.email === currentUserEmail);
        } catch (e) {
            error = e.message;
            console.error("Error loading saved articles:", e);
        } finally {
            loading = false;
        }
    }

    async function handleUnsave(article) {
        if (!currentUserEmail) {
            alert("Please log in to manage saved articles");
            return;
        }
        try {
            await unsaveArticle(currentUserEmail, article.url);
            savedArticles = savedArticles.filter(a => a.url !== article.url);
            alert("Article unsaved successfully!");
        } catch (e) {
            console.error("Error unsaving article:", e);
            alert("Error unsaving article: " + e.message);
        }
    }
</script>

<h1>Saved Articles</h1>

{#if loading}
    <p>Loading saved articles...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if savedArticles.length === 0}
    <p>You haven't saved any articles yet.</p>
{:else}
    <ul>
        {#each savedArticles as article (article.url)}
            <li>
                <h2>{article.article_name}</h2>
                <p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">{article.url}</a>
                </p>
                <button on:click={() => handleUnsave(article)}>
                    Unsave Article
                </button>
            </li>
        {/each}
    </ul>
{/if}

