<script>
  import { Router, Route, Link } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Feed from "./pages/Feed.svelte";
  import SubscribedFeeds from "./pages/SubscribedFeeds.svelte";
  import Article from "./pages/Article.svelte";
  import SavedArticles from "./pages/SavedArticles.svelte";
  import Register from "./pages/Register.svelte";
  import Settings from "./pages/Settings.svelte"; 

  export let url = "";
</script>

<Router {url}>
  <div class="feed-reader">
    <header class="feed-reader__header">
      <nav class="feed-reader__nav">
        <Link class="feed-reader__nav-link" to="/">Home</Link>
        <Link class="feed-reader__nav-link" to="/login">Login</Link>
        <Link class="feed-reader__nav-link" to="/register">Register</Link>
        <Link class="feed-reader__nav-link" to="/subscribedfeeds">Feeds</Link>
        <Link class="feed-reader__nav-link" to="/saved">Saved Articles</Link>
        <Link class="feed-reader__nav-link" to="/settings">Settings</Link>
      </nav>
    </header>

    <main class="feed-reader__main">
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/subscribedfeeds" component={SubscribedFeeds} />
      <Route path="/article/:url" component={Article} />
      <Route path="/feed/:url" component={Feed} />
      <Route path="/saved" component={SavedArticles} />
      <Route path="/settings" component={Settings} /> 
    </main>
  </div>
</Router>