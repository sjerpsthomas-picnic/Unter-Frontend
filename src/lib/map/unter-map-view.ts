import { request } from '../request.ts';

export type UnterMap = UnterMapNode[];

export type UnterMapNode = {
	draw_x: number;
	draw_y: number;

	id: number;

	edges: UnterMapEdge[];
};

export type UnterMapEdge = {
	to: number;
};

export type UnterMapRoute = {
	from: { draw_x: number; draw_y: number };
	to: { draw_x: number; draw_y: number };
}[];
export const requestMap = () =>
	request<UnterMap>('routing/map').then((newMap) => {
		const bounds = {
			minX: Math.min(...newMap.map((it) => it.draw_x)),
			maxX: Math.max(...newMap.map((it) => it.draw_x)),
			minY: Math.min(...newMap.map((it) => it.draw_y)),
			maxY: Math.max(...newMap.map((it) => it.draw_y))
		};

		const map: UnterMap = newMap.map((it) => ({
			...it,
			draw_x: (it.draw_x - bounds.minX) / (bounds.maxX - bounds.minX),
			draw_y: (it.draw_y - bounds.minY) / (bounds.maxY - bounds.minY)
		}));

		// Deduplicate edges
		const foundEdges: { from: number; to: number }[] = [];
		for (const node of map) {
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

		return map;
	});

export const requestRoute = (map: UnterMap) =>
	request<{ nodes: number[] }>(`routing/route`).then(({ nodes }) => {
		const res: UnterMapRoute = [];
		console.log(nodes);

		for (let i = 1; i < nodes.length; i++) {
			const prev = nodes[i - 1];
			const curr = nodes[i];

			const prevNode = map.find((n) => n.id === prev)!;
			const currNode = map.find((n) => n.id === curr)!;

			res.push({ from: prevNode, to: currNode });
		}

		console.log(res);
		return res;
	});
