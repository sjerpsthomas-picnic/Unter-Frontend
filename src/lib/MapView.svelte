<script lang="ts">
	import type { Node } from './map.ts';

	type Props = {
		mapNodes: Node[],
		onNodeClick: (node: Node) => void,
	};

	const { mapNodes, onNodeClick }: Props = $props();

	const bounds = {
		minX: Math.min(...mapNodes.map(it => it.draw_x)),
		maxX: Math.max(...mapNodes.map(it => it.draw_x)),
		minY: Math.min(...mapNodes.map(it => it.draw_y)),
		maxY: Math.max(...mapNodes.map(it => it.draw_y)),
	};

	const transformedMapNodes: Node[] = mapNodes.map(it => ({
		...it,
		draw_x: (it.draw_x - bounds.minX) / (bounds.maxX - bounds.minX),
		draw_y: (it.draw_y - bounds.minY) / (bounds.maxY - bounds.minY),
	}));

	const mapSize = 400;
	const dotSize = 30;

	const findNode = (id: number) => transformedMapNodes.find(n => n.id === id);
	const scale = (val: number) => val * (mapSize - 3 * dotSize) + dotSize + (dotSize / 2);
</script>

<div>
	<div class="bg-gray-700 size-fit p-5 rounded-3xl shadow-2xl">
		<h1 class="text-center mb-5 text-white">
			MAP
		</h1>

		<div class="rounded-2xl bg-blue-300" style="width: {mapSize}px; height: {mapSize}px;">
			<!-- Edges -->
			<svg class="absolute pointer-events-none" width={mapSize} height={mapSize}>
				{#each transformedMapNodes as node (node)}
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
				{#each transformedMapNodes as node (node.id)}
					<button onclick={() => onNodeClick(node)} aria-label="what?" class="absolute bg-white rounded-full flex items-center justify-center" style="width: {dotSize}px; height: {dotSize}px; transform: translate({node.draw_x * (mapSize - 3 * dotSize) + dotSize}px, {node.draw_y * (mapSize - 3 * dotSize) + dotSize}px)">
						{node.id}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>