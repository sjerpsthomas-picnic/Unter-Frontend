<script lang="ts">
	import type { MapNode } from './map.ts';
	import { requestMap } from './request.ts';
	import { onMount } from 'svelte';

	type Props = {
		onNodeClick: (node: MapNode) => void,
	};

	const { onNodeClick }: Props = $props();

	let map: MapNode[] = $state([]);
	onMount(async() => {
		const newMap = await requestMap();

		const bounds = {
			minX: Math.min(...newMap.map(it => it.draw_x)),
			maxX: Math.max(...newMap.map(it => it.draw_x)),
			minY: Math.min(...newMap.map(it => it.draw_y)),
			maxY: Math.max(...newMap.map(it => it.draw_y)),
		};

		map = newMap.map(it => ({
			...it,
			draw_x: (it.draw_x - bounds.minX) / (bounds.maxX - bounds.minX),
			draw_y: (it.draw_y - bounds.minY) / (bounds.maxY - bounds.minY),
		}));
	})

	const mapSize = 400;
	const dotSize = 40;

	const findNode = (id: number) => map.find(n => n.id === id);
	const scale = (val: number) => val * (mapSize - 3 * dotSize) + dotSize + (dotSize / 2);
</script>

<div>
	<div class="bg-gray-700 size-fit p-5 rounded-3xl shadow-2xl">
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
								x1={scale(node.draw_x)}
								y1={scale(node.draw_y)}
								x2={scale(target.draw_x)}
								y2={scale(target.draw_y)}
								stroke="black"
								stroke-width="4"
							/>
						{/if}
					{/each}
				{/each}
			</svg>

			<!-- Nodes -->
			<div class="absolute" style="width: {mapSize}px; height: {mapSize}px;">
				{#each map as node (node.id)}
					<button onclick={() => onNodeClick(node)} aria-label="what?" class="absolute bg-white rounded-full flex items-center justify-center" style="width: {dotSize}px; height: {dotSize}px; transform: translate({node.draw_x * (mapSize - 3 * dotSize) + dotSize}px, {node.draw_y * (mapSize - 3 * dotSize) + dotSize}px)">
						{node.id}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>