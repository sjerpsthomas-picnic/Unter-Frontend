const BACKEND_URL = 'http://localhost:8080/';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type CallResponse<T> = { ok: true; data: T } | { ok: false; error: any };

export async function callWithResponse<T>(
	endpoint: string,
	method: Method = 'GET',
	body: object = {}
): Promise<CallResponse<T>> {
	endpoint = endpoint.replace(/^\//, '');

	const res = await fetch(BACKEND_URL + endpoint, {
		method,
		body: method === "GET" ? undefined : JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) return { ok: false, error: await res.json() };

	return { ok: true, data: (await res.json()) as T };
}

export async function callWithOk(
	endpoint: string,
	method: Method = 'GET',
	body: object = {}
): Promise<boolean> {
	endpoint = endpoint.replace(/^\//, '');

	const res = await fetch(BACKEND_URL + endpoint, {
		method,
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	return res.ok;
}