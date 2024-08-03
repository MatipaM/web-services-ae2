<script>
  import { onMount } from 'svelte';
  import { login, logout, isAuthenticated, user } from '../stores/auth.js';
  
  let username = '';
  let password = '';
  let loggedIn = false;
  let errorMessage = '';

  $: loggedIn = $isAuthenticated;

  function handleSubmit(event) {
    event.preventDefault();
    
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        login(data.user.email);
        errorMessage = '';
      } else {
        errorMessage = data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorMessage = 'An error occurred. Please try again.';
    });
  }

  function handleLogout() {
    logout();
    username = '';
    password = '';
  }

  function checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      loggedIn = true;
    }
  }

  onMount(checkLoginStatus);
</script>


{#if loggedIn}
  <div class="login-container">
    <h1>Welcome, {JSON.parse(localStorage.getItem('user')).email}</h1>
    <button on:click={handleLogout}>LOGOUT</button>
  </div>
{:else}
  <div class="login-container">
    <h1>USER LOGIN</h1>
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}
    <form on:submit={handleSubmit}>
      <div class="input-group">
        <span class="icon">&#128100;</span>
        <input type="text" placeholder="Username" bind:value={username} required>
      </div>
      <div class="input-group">
        <span class="icon">&#128274;</span>
        <input type="password" placeholder="Password" bind:value={password} required>
      </div>
      <button type="submit">LOGIN</button>
    </form>
  </div>
{/if}
