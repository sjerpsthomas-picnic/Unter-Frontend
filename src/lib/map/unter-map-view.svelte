<script lang="ts">
	import { requestMap, requestRoute, type UnterMapNode, type UnterMapRoute } from './unter-map-view.ts';
	import { onMount } from 'svelte';

	type Props = {
		onNodeClick: (node: UnterMapNode) => void,
	};

	const { onNodeClick }: Props = $props();

	let map: UnterMapNode[] = $state([]);
	let route: UnterMapRoute = $state([]);
	onMount(async() => {
		map = await requestMap();
		route = await requestRoute(map);
	})

	const mapSize = 400;
	const dotSize = 40;

	const findNode = (id: number) => map.find(n => n.id === id);
	const scale = (val: number) => val * (mapSize - 3 * dotSize) + dotSize;
</script>

<div>
	<div class="bg-gray-700 size-fit p-5 pb-10 rounded-t-3xl shadow-2xl">
		<h1 class="text-center mb-5 text-white font-bold">
			MAP
		</h1>

		<div class="rounded-2xl bg-blue-300" style="width: {mapSize}px; height: {mapSize}px;">
			<!-- Edges -->
			<svg class="absolute pointer-events-none" width={mapSize} height={mapSize}>
				{#each map as node (node)}
					{#each node.edges as edge (edge)}
						{@const target = findNode(edge.to)}
						{#if target}
							<line
								x1={scale(node.draw_x) + dotSize / 2}
								y1={scale(node.draw_y) + dotSize / 2}
								x2={scale(target.draw_x) + dotSize / 2}
								y2={scale(target.draw_y) + dotSize / 2}
								stroke="#00000088"
								stroke-width="3"
							/>
						{/if}
					{/each}
				{/each}

				{#each route as routeEdge (routeEdge)}
					<line
						x1={scale(routeEdge.from.draw_x) + dotSize / 2}
						y1={scale(routeEdge.from.draw_y) + dotSize / 2}
						x2={scale(routeEdge.to.draw_x) + dotSize / 2}
						y2={scale(routeEdge.to.draw_y) + dotSize / 2}
						stroke="#cce7c9"
						stroke-width="4"
					/>
				{/each}
			</svg>



			<!-- Nodes -->
			<div class="absolute" style="width: {mapSize}px; height: {mapSize}px;">
				{#each map as node (node.id)}
					<button onclick={() => onNodeClick(node)} aria-label="what?"
									class="absolute bg-white rounded-full flex items-center justify-center"
									style="width: {dotSize}px; height: {dotSize}px; transform: translate({scale(node.draw_x)}px, {scale(node.draw_y)}px)">
						{node.id}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>