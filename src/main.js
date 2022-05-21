import App from './App.svelte';

const app = new App({
	target: document.body,
	compilerOptions: {
		hydratable: true,
	},
	props: {
		name: 'world'
	}
});

export default app;
