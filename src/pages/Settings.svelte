<script>
  import { onMount } from "svelte";
  import { userEmail } from "../stores/auth.js";
  import { getSubscribedFeeds, saveFeed, unsaveFeed } from "../api.js";

  let subscribedFeeds = [];
  let newFeedName = "";
  let newFeedUrl = "";
  let error = "";
  let successMessage = "";

  $: currentUserEmail = $userEmail;

  onMount(async () => {
    await loadSubscribedFeeds();
  });

  async function loadSubscribedFeeds() {
  try {
    const feeds = await getSubscribedFeeds(currentUserEmail);
    console.log('Loaded subscribed feeds:', feeds);
    subscribedFeeds = feeds;
  } catch (e) {
    console.error('Error loading subscribed feeds:', e);
    error = 'Failed to load subscribed feeds. Please try again.';
  }
}

async function handleRemoveFeed(feedUrl) {
  try {
    const result = await unsaveFeed(currentUserEmail, feedUrl);
    if (result.success) {
      await loadSubscribedFeeds();
      successMessage = 'Feed removed successfully!';
      error = '';
    } else {
      throw new Error(result.message || 'Unknown error occurred');
    }
  } catch (e) {
    console.error('Error removing feed:', e);
    if (e.message === 'Subscription not found') {
      error = 'This feed is not in your subscriptions. Refreshing feed list...';
      await loadSubscribedFeeds();
    } else {
      error = `Failed to remove feed: ${e.message}`;
    }
    successMessage = '';
  }
}

  async function handleAddFeed() {
    if (!newFeedName || !newFeedUrl) {
      error = "Please enter both feed name and URL.";
      return;
    }

    try {
      await saveFeed(currentUserEmail, newFeedName, newFeedUrl);
      await loadSubscribedFeeds();
      newFeedName = "";
      newFeedUrl = "";
      successMessage = "Feed added successfully!";
      error = "";
    } catch (e) {
      error = "Failed to add feed. Please try again.";
      successMessage = "";
    }
  }
</script>

<main class="settings">
  <h1>Account Settings</h1>

  <section class="user-info">
    <h2>User Information</h2>
    <p>Email: {currentUserEmail}</p>
  </section>

  <section class="feed-management">
    <h2>Manage Subscribed Feeds</h2>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    {#if successMessage}
      <p class="success">{successMessage}</p>
    {/if}

    <div class="add-feed">
      <h3>Add New Feed</h3>
      <input type="text" placeholder="Feed Name" bind:value={newFeedName} />
      <input type="url" placeholder="Feed URL" bind:value={newFeedUrl} />
      <button on:click={handleAddFeed}>Add Feed</button>
    </div>

    <div class="subscribed-feeds">
      <h3>Your Subscribed Feeds</h3>
      {#if subscribedFeeds.length === 0}
        <p>You haven't subscribed to any feeds yet.</p>
      {:else}
        <ul>
          {#each subscribedFeeds as feed}
            <li>
              <span>{feed.feed_name}</span>
              <a href={feed.url} target="_blank" rel="noopener noreferrer"
                >{feed.url}</a
              >
              <button on:click={() => handleRemoveFeed(feed.url)}>Remove</button
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
</main>
