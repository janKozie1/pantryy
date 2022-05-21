<script>
	import { Router, Route, Link } from "svelte-routing";
	import Home from "./pages/Home.svelte";
	import About from "./pages/About.svelte";
	export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router {url}>
	<nav>
		<Link to="/">Home</Link>
		<Link to="about">About</Link>
	</nav>
	<div>
		<Route path="about" component={About} />
		<Route path="/"><Home /></Route>
	</div>
</Router>
