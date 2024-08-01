<script>
  import { Router, Route, Link } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Feeds from "./pages/Feeds.svelte";
  import Feed from "./pages/Feed.svelte";
  import SubscribeFeeds from "./pages/SubscribeFeeds.svelte";
  import Article from "./pages/Article.svelte";
  import SavedArticles from "./pages/SavedArticles.svelte";

  export let url = "";
</script>

<Router url={url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/feeds">Feeds</Link>
    <Link to="/saved">Saved Articles</Link>
  </nav>

  <main>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/feeds" component={Feeds} />
    <Route path="/article/:url" component={Article} />
    <Route path="/feed/:url" component={Feed} />
    <Route path="/saved" component={SavedArticles} />
  </main>
</Router>

<style>
  nav {
    padding: 1em;
    background-color: #f0f0f0;
  }
  main {
    padding: 1em;
  }
</style>