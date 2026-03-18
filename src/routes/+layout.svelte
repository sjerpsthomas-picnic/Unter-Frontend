<script lang="ts">
	import './layout.css';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';

	let greeting = $state("")
	onMount(() => {
		const token = localStorage.getItem("token")
		if (token) {
			const decoded = jwtDecode(token)
			greeting = "Hello, " + (decoded.sub ?? "Unknown") + "!"
		}
		else {
			greeting = "You're not logged in!"
		}
	})

	let { children } = $props();
</script>

<div class="app">
	<main class="w-[70%] mx-auto t-10 p-5">
		<p class="text-center text-sm mb-4 text-gray-500 italic">{greeting}</p>

		{@render children()}
	</main>
</div>
