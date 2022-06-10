<script lang="ts">
	import { Router, Route } from "svelte-navigator";

	import { Routes } from "./config";

	import AuthRoute from "./components/organisms/AuthRoute.svelte";

	import Home from "./pages/Home.svelte";
	import Auth from "./pages/Auth.svelte";
	import Product from "./pages/Product.svelte";
	import Pantry from "./pages/Pantry.svelte";
	import ServicesProvider from "./components/organisms/ServicesProvider.svelte";
</script>

<Router>
	<ServicesProvider>
		<Route path={Routes.register}>
			<AuthRoute isProtected={false} redirectTo={Routes.pantry}>
				<Auth />
			</AuthRoute>
		</Route>
		<Route path={Routes.login}>
			<AuthRoute isProtected={false} redirectTo={Routes.pantry}>
				<Auth />
			</AuthRoute>
		</Route>
		<Route path={Routes.pantry}>
			<AuthRoute isProtected redirectTo={Routes.login}>
				<Pantry />
			</AuthRoute>
		</Route>
		<Route path={Routes.product} let:params>
			<AuthRoute isProtected redirectTo={Routes.login}>
				<Product productId={params.id} />
			</AuthRoute>
		</Route>
		<Route path={Routes.home}><Home /></Route>
	</ServicesProvider>
</Router>
