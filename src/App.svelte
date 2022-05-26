<script lang="ts">
	import { Router, Route } from "svelte-routing";

	import Home from "./pages/Home.svelte";
	import About from "./pages/About.svelte";
	import Auth from "./pages/Auth.svelte";
</script>

<Router url={""}>
	<!-- <nav>
		<Link to="/">Home</Link>
		<Link to="about">About</Link>
	</nav> -->
	<Route path="about" component={About} />
	<Route path="login" component={Auth} />
	<Route path="register" component={Auth} />
	<Route path="/"><Home /></Route>
</Router>
