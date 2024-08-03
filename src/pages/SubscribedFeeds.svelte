<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { getFeed, saveFeed, isFeedSaved, getFeeds} from "../api.js";
    import { userEmail } from "../stores/auth.js"; 

    export let url = "";

    let feed = null;
    let feeds = null;
    let error = null;
    let loading = true;
    let isSaved = false;
    let savedFeeds = []

    $: currentUserEmail = $userEmail;
    // console.log(currentUserEmail, userEmail)


    async function checkIfSaved(subscribedFeed) {
        try {
            const result = await isFeedSaved(currentUserEmail, subscribedFeed.url);
            isSaved = result.isSaved;
            return true;
        } catch (e) {
            console.error("Error checking if feed is saved:", e);
            return false;
        }
    }

    onMount(async () => {
         console.log("is running")
        try {
            feeds = await getFeeds();
            for(let f = 0; f<feeds.length; f++){
                if(checkIfSaved(f)){
                    savedFeeds.push(f);
                }
            }
                
            
            // if (currentUserEmail) {
            //     const result = await isFeedSaved(
            //         currentUserEmail,
            //         feed.url,
            //     );
            //     isSaved = result.isSaved;
            //}
        } catch (e) {
            console.log(e)
        } finally {
            loading = false;
        }
    });

    async function handleSubscribe() {
        if (!currentUserEmail) {
            alert("Please log in to subscribe to new feeds");
            
            return;
        } 
        try {
            await saveFeed({
                email: currentUserEmail,
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

<!-- {#if loading}
    <p>Loading feed...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if checkIfSaved(feed)}
    <h1>{feed.feed_name}</h1>
    <p>
        URL: <a href={feed.url} target="_blank" rel="noopener noreferrer"
            >{feed.url}</a
        >
    </p>

    <button on:click={handleSubscribe}>
        {isSaved ? "Unsubscribe to feed" : "Subscribe to feed"}
    </button>
{:else if checkIfSaved(feed)}


{:else}
    <p>No feed found</p>
{/if} -->

<h1>Your subscribed Feeds</h1>
<!-- if user logged in, show subscribed feeds instead -->
{#if error}
    <p>Error: {error}</p>
{:else}
    {#if savedFeeds.length > 0}
        <div class="article-container">
            {#each savedFeeds as feed}
                <div class="article-box">
                    <Link class="article-link" to={`/subscribedfeeds/${encodeURIComponent(feed.url)}`}>
                    <!-- <Link class="article-link" to={feed.url}>  -->
                        {feed.feed_name}
                    </Link>
                </div>
            {/each}
        </div>
    {:else if currentUserEmail == undefined}
        <p>Please sign in to see subscribed feeds</p>
    {:else}
        <p>No feeds available</p>
    {/if}

{/if}
