<script>
	import Login from './Login.svelte';
	import Register from './Register.svelte';
  
	let showLogin = true;
  </script>
  
  <main>
	<button on:click={() => showLogin = !showLogin}>
	  {showLogin ? 'Switch to Register' : 'Switch to Login'}
	</button>
  
	{#if showLogin}
	  <Login />
	{:else}
	  <Register />
	{/if}
  </main>
  
  <style>
	main {
	  text-align: center;
	  padding: 1em;
	  max-width: 240px;
	  margin: 0 auto;
	}
	button {
	  margin-bottom: 1em;
	}
	form {
	  display: flex;
	  flex-direction: column;
	}
	label {
	  margin: 0.5em 0;
	}
  </style>
  
