const BACKEND_URL = 'http://localhost:8080/';

export function request<T>(endpoint: string): Promise<T> {
	endpoint = endpoint.replace(/^\//, '');
	return fetch(BACKEND_URL + endpoint, {})
		.then((res) => res.json())
		.then((res) => res as T);
}

export function call(endpoint: string, method: string = "GET", body: object = {}): Promise<void> {
	endpoint = endpoint.replace(/^\//, '');
	return fetch(BACKEND_URL + endpoint, { method, body: JSON.stringify(body) })
		.then(it => it.text())
		.then(it => console.log(it))
}