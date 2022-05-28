<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import { setContext } from "svelte";

	import services, { SERVICES_KEY } from "./services";

	import Home from "./pages/Home.svelte";
	import Auth from "./pages/Auth.svelte";
	import { Routes } from "./config";

	setContext(SERVICES_KEY, services);
</script>

<Router url={""}>
	<Route path={Routes.register} component={Auth} />
	<Route path={Routes.login} component={Auth} />
	<Route path={Routes.home}><Home /></Route>
</Router>
