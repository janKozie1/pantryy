<script lang="ts">
	import { Router, Route } from "svelte-routing";

	import Home from "./pages/Home.svelte";
	import Auth from "./pages/Auth.svelte";
	import { Routes } from "./config";
</script>

<Router url={""}>
	<Route path={Routes.register} component={Auth} />
	<Route path={Routes.login} component={Auth} />
	<Route path={Routes.home}><Home /></Route>
</Router>
