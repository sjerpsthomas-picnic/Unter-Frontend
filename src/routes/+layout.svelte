<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="app bg-gray-300 h-screen p-10">
	<main class="w-[70%] mx-auto t-10 bg-white shadow-2xl rounded-xl p-5">
		{@render children()}
	</main>
</div>
