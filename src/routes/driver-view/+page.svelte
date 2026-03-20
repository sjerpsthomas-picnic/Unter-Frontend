<script lang="ts">
	import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';
	import Circle from '$lib/circle.svelte';
	import { onMount } from 'svelte';
	import api from '$lib/api.ts';
	import type { AxiosResponse } from 'axios';
	import { jwtDecode } from 'jwt-decode';

	type Request = {
		id: string;
		user: string;
		from: string;
		to: string;
	}

	let requests: Request[] = $state([])

	const getId = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		const { id } = jwtDecode<{ id: string }>(token);

		const res = await api.get("api/driver/user/" + id) as AxiosResponse<{
			id: string;
		}>;

		if (res.status !== 200) return;

		return res.data.id;
	}

	const setRequests = async () => {
		const res = await api.get("api/driver/requests/pending/" + await getId()) as AxiosResponse<{
			id: string;
			username: string;
			pickUpNode: string; // name of the node
			dropOffNode: string; // name of the node
		}[]>;

		if (res.status !== 200) {
			alert("Failed to fetch requests")
			return;
		}

		requests = res.data.map((it) => ({
			id: it.id,
			user: it.username,
			from: it.pickUpNode,
			to: it.dropOffNode
		}));
	}

	onMount(setRequests)

	let accept = async (requestId: string) => {
		const res = await api.post("api/driver/requests/" + requestId + "/accept?driverId=" + await getId())

		if (res.status !== 200) {
			alert("Failed to accept request")
			return;
		}

		setTimeout(async () => complete(requestId), 2000)
	}

	let deny = async (requestId: string) => {
		const res = await api.post("api/driver/requests/" + requestId + "/reject?driverId=" + await getId())

		if (res.status !== 200) {
			alert("Failed to accept request")
			return;
		}

		await setRequests();
	}

	let complete = async (requestId: string) => {
		const res = await api.post("api/driver/requests/" + requestId + "/complete?driverId=" + await getId())

		if (res.status !== 200) {
			alert("Failed to complete request")
			return;
		}

		await setStatus();
		await setRequests();
	}

	let fuel: number = $state(0)
	let maxFuel: number = $state(0)
	let currentNode: string | undefined = $state(undefined)

	let setStatus = async () => {
		const res = await api.get("api/driver/" + await getId() + "/status") as AxiosResponse<{
			currentNode: string;
			currentFuel: number;
			maxTank: number;
		}>

		if (res.status !== 200) {
			alert("Failed to fetch fuel")
			return;
		}

		fuel = res.data.currentFuel;
		maxFuel = res.data.maxTank;
		currentNode = res.data.currentNode;
	}

	onMount(setStatus)

	let setCurrentNode = async (node: UnterMapNode) => {
		const res = await api.post("api/driver/" + await getId() + "/updateLocation?newNode=" + node.name);

		if (res.status !== 200) {
			alert("Failed to set current node")
			return;
		}

		currentNode = node.name;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="flex flex-row space-x-10 justify-center">
		<div>
			<UnterMapView highlightedNodeName={currentNode} onNodeClick={setCurrentNode}/>
			<div class="w-full bg-fuchsia-300 flex flex-row items-center space-x-4 p-5 rounded-b-2xl">
				<p>Fuel left:</p>
				<div class="h-6 w-80 border bg-gray-50 rounded-full shadow-xl overflow-clip">
					<div class="h-full bg-green-500 text-sm text-center align-center text-white" style="width: {fuel / maxFuel * 100}%">
						{fuel} / {maxFuel}
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-5 w-110">
			<h1 class="mx-auto font-bold mt-5">REQUESTS</h1>

			{#if requests.length === 0}
				<p class="text-center">You don't have any requests.</p>
			{/if}

			{#each requests as request (request.id)}
				<div class="w-full h-fit bg-[#fff0e7] p-5 rounded-3xl border shadow-lg">
					<div class="flex flex-row gap-5 mb-2 justify-center items-center">

						<div class="text-center text-xl font-bold">{request.user} wants to go</div>

						<div class="flex flex-row justify-center items-center gap-2 text-center">
							<div>
								<p class="mb-1 italic">from</p>
								<Circle value={request.from}/>
							</div>
							<p class="text-2xl mt-6 font-bold">→</p>
							<div>
								<p class="mb-1 italic">to</p>
								<Circle value={request.to}/>
							</div>
						</div>

					</div>

					<div class="flex flex-row justify-center items-center gap-4">
						<button onclick={() => accept(request.id)} class="green-button mt-2 w-40" type="submit" form="sisu-form" value="Submit">
							Accept
						</button>

						<button onclick={() => deny(request.id)} class="red-button mt-2 w-40" type="submit" form="sisu-form" value="Submit">
							Deny
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
