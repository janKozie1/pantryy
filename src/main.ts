import App from './App.svelte';

const config = {
	target: document.body,
	compilerOptions: {
		hydratable: true,
	},
};

const app = new App(config);

export default app;
