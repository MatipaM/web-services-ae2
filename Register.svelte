<script>
  let email = '';
  let confirmEmail = '';
  let password = '';
  let message = '';

  function register() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      message = 'User already exists.';
    } else if (email !== confirmEmail) {
      message = 'Emails do not match.';
    } else {
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      message = 'Registration successful!';
    }
  }
</script>

<h2>Register</h2>
<form on:submit|preventDefault={register}>
  <div class="form-group">
    <label for="email">Email:</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      placeholder="Enter your email"
    />
  </div>
  
  <div class="form-group">
    <label for="confirmEmail">Confirm Email:</label>
    <input
      id="confirmEmail"
      type="email"
      bind:value={confirmEmail}
      required
      placeholder="Confirm your email"
    />
  </div>
  
  <div class="form-group">
    <label for="password">Password:</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      required
      placeholder="Enter your password"
    />
  </div>
  
  <button type="submit">Register</button>
</form>

<p class="message">{message}</p>

<style>
  /* Background Styling */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #8BC34A;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Form Styling */
  form {
    background-color: #71C15C;
    padding: 2em;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    width: 100%;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #fff;
  }

  .form-group {
    margin-bottom: 1.5em;
  }

  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
    color: #fff;
  }

  input {
    width: 100%;
    padding: 10px 10px;
    font-size: 16px;
    border: none;
    background-color: #2A3742;
    color: #ccc;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    color: white;
    background-color: #FF5722;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #e64a19;
  }

  .message {
    text-align: center;
    margin-top: 1em;
    color: white;
    font-weight: bold;
  }
</style>
