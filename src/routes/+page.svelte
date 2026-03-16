<script lang="ts">
	import MapView from '$lib/MapView.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<p>
		Asdf!
	</p>

	<MapView mapNodes={[{x: 0, y: 0, children: []}, {x: 80, y: 2, children: []}]}/>
</section>
