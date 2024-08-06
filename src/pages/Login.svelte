<script>
  function handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("Username:", username);
    console.log("Password:", password);
    // You can handle form submission here, e.g., send data to a server
  }
</script>

<div class="login-container">
  <h1>USER LOGIN</h1>
  <form onsubmit="handleSubmit(event)">
    <div class="input-group">
      <span class="icon">&#128100;</span>
      <input type="text" id="username" placeholder="Username" required>
    </div>
    <div class="input-group">
      <span class="icon">&#128274;</span>
      <input type="password" id="password" placeholder="Password" required>
    </div>
    <button type="submit">LOGIN</button>
  </form>
</div>
