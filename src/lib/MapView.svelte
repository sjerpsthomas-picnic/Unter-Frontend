<script lang="ts">
	import type { MapNode } from './map.ts';

	type Props = {
		mapNodes: MapNode[],
	};

	const { mapNodes }: Props = $props();
</script>

<div>
	<p>Map nodes:</p>
	{#each mapNodes as node, i (node)}
		<li>{i + 1}: {node.x}, {node.y}</li>
	{/each}
</div>