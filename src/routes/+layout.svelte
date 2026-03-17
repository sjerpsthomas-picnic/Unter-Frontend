<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="app p-10">
	<main class="w-[70%] mx-auto t-10 p-5">
		{@render children()}
	</main>
</div>
