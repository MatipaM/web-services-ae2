<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { login, logout, isAuthenticated, user } from '../stores/auth.js';
  
  let username = '';
  let firstname = '';
  let lastname = '';
  let dob = '';
  let email = '';
  let address = '';
  let password = '';
  let loggedIn = false;
  let errorMessage = '';
  let h1;

  $: loggedIn = $isAuthenticated;

  const saltRounds = 10;

  function handleSubmit(event) {
  event.preventDefault();
  
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, firstname, lastname, dob, email, address, password })
  })
  .then(response => response.json())
  .then(data => {
    console.log("data", data);
    if (data.success) {
      if (h1) {
        h1.innerHTML = 'You have been registered, please login';
      }
      navigate('/login');
    } else {
      errorMessage = data.message || 'Registration failed. Please try again.';
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

  onMount(() => {
    h1 = document.getElementById('h1');
    h1.innerHTML = 'Please register';
  });
</script>

{#if loggedIn}
<div class="login-container">
  <h1 id="h1">Welcome, {JSON.parse(localStorage.getItem('user')).email}</h1>
  <button on:click={handleLogout}>LOGOUT</button>
</div>
{:else}
<div class="login-container">
  <h1 id="h1">Register</h1>
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
  <form on:submit={handleSubmit}>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="firstname" bind:value={firstname} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="lastname" bind:value={lastname} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="dob" bind:value={dob} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="email" bind:value={email} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="address" bind:value={address} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" placeholder="username" bind:value={username} required>
    </div>
    <div class="input-group">
      <span class="icon">&#128274;</span>
      <input type="password" placeholder="Password" bind:value={password} required>
    </div>
    <button type="submit">Register</button>
  </form>
</div>
{/if}
