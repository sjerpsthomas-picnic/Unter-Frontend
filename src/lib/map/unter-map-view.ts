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

	return {
		id,
		name,
		nodes
	};
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