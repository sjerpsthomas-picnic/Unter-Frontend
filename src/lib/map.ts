
export type MapNode = {
	draw_x: number;
	draw_y: number;

	id: number;

	edges: Edge[];
};

export type Edge = {
	to: number,
}
