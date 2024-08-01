<script>
  let username = '';
  let password = '';

  function handleSubmit(event) {
      event.preventDefault();
      console.log("Username:", username);
      console.log("Password:", password);
      // You can handle form submission here, e.g., send data to a server
  }
</script>

<style>
  body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;Å
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-size: cover; /* Make sure the background covers the entire page */
  }

  .login-container {
      background-color: rgba(38, 173, 94, 0.85); /* Semi-transparent background for contrast */
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      color: white;
      max-width: 400px;
      width: 100%;
  }

  h1 {
      margin-bottom: 20px;
      font-size: 24px;
  }

  .input-group {
      margin-bottom: 20px;
      position: relative;
  }

  .input-group .icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
  }

  input[type="text"],
  input[type="password"] {
      width: 100%;
      padding: 10px 40px;
      border-radius: 5px;
      border: none;
      background-color: #1b3a4b;
      color: white;
  }

  button {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: #ff3e00;
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }

  button:hover {
      background-color: #e63600;
  }
</style>

<div class="login-container">
  <h1>USER LOGIN</h1>
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
