import type { MapNode } from './map.ts';

const BACKEND_URL = 'http://localhost:8080/api/'

function request<T>(endpoint: string): Promise<T> {
	endpoint = endpoint.replace(/^\//, '');
	return fetch(BACKEND_URL + endpoint, {}).then(res => res.json()).then(res => res as T);
}

export const requestMap =
	() => request<MapNode[]>('routing/map');
