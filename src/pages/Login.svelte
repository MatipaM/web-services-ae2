<script>
    import { login } from '../stores/auth.js';
    
    function handleLogin() {
      login({ email: 'test@example.com' });
    }
    </script>
    
    <button on:click={handleLogin}>Login</button>