import { type AxiosResponse } from 'axios';
import api from '/src/lib/api.ts';

export type UnterMap = {
	id: string;
	name: string;

	nodes: UnterMapNode[];
}

export type UnterMapNode = {
	draw_x: number;
	draw_y: number;

	id: number;
	name: string;
	isGasStation: boolean;

	edges: UnterMapEdge[];
};

export type UnterMapEdge = {
	to: number;
};

export type UnterMapRoute = {
	from: { draw_x: number; draw_y: number };
	to: { draw_x: number; draw_y: number };
}[];

export async function requestMap(): Promise<UnterMap | undefined>{
	const res = await api('http://localhost:8080/graphs/getAllGraphs') as AxiosResponse<{
		id: string;
		name: string;
		nodeCount: number;
		edges: { source: number; to: number }[];
		gasStations: number[];
		nodeMap: Record<string, number>;
	}[]>
	if (res.status !== 200) {
		return undefined;
	}

	// Random number with seed
	const random = (seed: number) => Math.sin(seed++) * 10000;

	const { id, name, nodeCount, edges, gasStations, nodeMap } = res.data[0];

	localStorage.setItem('graphName', name);

	const nodes: UnterMapNode[] = [];
	for (let i = 0; i < nodeCount; i++) {
		nodes.push({
			id: i,
			name: Object.keys(nodeMap).find((key) => nodeMap[key] === i) ?? `Node ${i}`,
			isGasStation: gasStations.includes(i),
			draw_x: random(i), // TODO: make this more realistic
			draw_y: random(i + 10),
			edges: edges.filter((it) => it.source === i).map((it) => ({ to: it.to }))
		});
	}

	const bounds = {
		minX: Math.min(...nodes.map((it) => it.draw_x)),
		maxX: Math.max(...nodes.map((it) => it.draw_x)),
		minY: Math.min(...nodes.map((it) => it.draw_y)),
		maxY: Math.max(...nodes.map((it) => it.draw_y))
	};

	for (const node of nodes) {
		node.draw_x = (node.draw_x - bounds.minX) / (bounds.maxX - bounds.minX);
		node.draw_y = (node.draw_y - bounds.minY) / (bounds.maxY - bounds.minY);
	}

	const foundEdges: { from: number; to: number }[] = [];
	for (const node of nodes) {
		node.edges = node.edges.filter((edge) => {
			const edgeAlreadyFound = foundEdges.some(
				(it) =>
					(it.from === edge.to && it.to === node.id) || (it.from === node.id && it.to === edge.to)
			);
			if (edgeAlreadyFound) return false;

			foundEdges.push({ from: node.id, to: edge.to });
			return true;
		});
	}


	return applySpringSimulation({
		id,
		name,
		nodes
	}, 100);
}

function clamp(a: number, min: number, max: number): number {
	return Math.min(Math.max(a, min), max);
}

function applySpringSimulation(map: UnterMap, iterations: number): UnterMap {
	const nodes = [...map.nodes];// Ideal distance between nodes
	const repulsion = 0.05; // Strength of node pushing away from others
	const attraction = 0.05; // Strength of the "spring"

	for (let i = 0; i < iterations; i++) {
		// 1. Calculate Repulsion (All nodes vs All nodes)
		for (let a = 0; a < nodes.length; a++) {
			for (let b = 0; b < nodes.length; b++) {
				if (a === b) continue;

				const dx = nodes[a].draw_x - nodes[b].draw_x;
				const dy = nodes[a].draw_y - nodes[b].draw_y;
				const distance = Math.sqrt(dx * dx + dy * dy) || 1;

				// Coulomb's Law style repulsion
				const force = repulsion / (distance * distance);
				nodes[a].draw_x += (dx / distance) * force;
				nodes[a].draw_y += (dy / distance) * force;

				nodes[a].draw_x = clamp(nodes[a].draw_x, 0, 1);
				nodes[a].draw_y = clamp(nodes[a].draw_y, 0, 1);
			}
		}

		// 2. Calculate Attraction (Only connected nodes)
		nodes.forEach((node) => {
			node.edges.forEach((edge) => {
				const target = nodes.find((n) => n.id === edge.to);
				if (!target) return;

				const dx = target.draw_x - node.draw_x;
				const dy = target.draw_y - node.draw_y;
				const distance = Math.sqrt(dx * dx + dy * dy) || 1;

				// Hooke's Law style attraction
				const force = distance * attraction;
				node.draw_x += (dx / distance) * force;
				node.draw_y += (dy / distance) * force;
				target.draw_x -= (dx / distance) * force;
				target.draw_y -= (dy / distance) * force;

				node.draw_x = clamp(node.draw_x, 0, 1);
				node.draw_y = clamp(node.draw_y, 0, 1);
				target.draw_x = clamp(target.draw_x, 0, 1);
				target.draw_y = clamp(target.draw_y, 0, 1);
			});
		});
	}

	return { ...map, nodes };
}

export async function requestRoute(map: UnterMap) {
	return []

	// const res = await callWithResponse<{ nodes: number[] }>('api/routing/route');
	// if (!res.ok) return [];
	// const { nodes } = res.data;
	//
	// const route: UnterMapRoute = [];
	//
	// for (let i = 1; i < nodes.length; i++) {
	// 	const prev = nodes[i - 1];
	// 	const curr = nodes[i];
	//
	// 	const prevNode = map.nodes.find((n) => n.id === prev)!;
	// 	const currNode = map.nodes.find((n) => n.id === curr)!;
	//
	// 	route.push({ from: prevNode, to: currNode });
	// }
	//
	// return route;
}