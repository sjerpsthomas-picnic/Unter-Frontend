
export type Node = {
	draw_x: number;
	draw_y: number;

	id: number;

	edges: Edge[];
};

export type Edge = {
	to: number,
}

export const TEMP_MAP: Node[] = [
	{ draw_x: 5, draw_y: 0, id: 0, edges: [{ to: 1 }] },
	{ draw_x: 10, draw_y: 10, id: 1, edges: [{ to: 0 }] },
	{ draw_x: 18, draw_y: 23, id: 2, edges: [{ to: 2 }] },
	{ draw_x: 6, draw_y: 8, id: 3, edges: [{ to: 1 }] },
]
