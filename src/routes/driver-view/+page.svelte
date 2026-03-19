<script lang="ts">
	import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';
	import Circle from '$lib/circle.svelte';
	import { onMount } from 'svelte';
	import api from '$lib/api.ts';
	import type { AxiosResponse } from 'axios';
	import { jwtDecode } from 'jwt-decode';

	const populateForm = (node: UnterMapNode) => {
		const fromElement = document.getElementById("from") as HTMLInputElement
		const toElement = document.getElementById("to") as HTMLInputElement

		if (fromElement.value.trim() === "")
			fromElement.value = node.id.toString();
		else if (toElement.value.trim() === "")
			toElement.value = node.id.toString();
		else {
			fromElement.value = "";
			toElement.value = "";
			populateForm(node);
		}
	}

	type Request = {
		id: string;
		user: string;
		from: string;
		to: string;
	}

	let requests: Request[] = $state([])

	onMount(async () => {
		const res = await api.get("api/driver/requests/pending") as AxiosResponse<{
			id: string;
			username: string;
			pickupNode: string; // name of the node
			dropoffNode: string; // name of the node
		}[]>;

		alert(JSON.stringify(res.data))

		if (res.status !== 200) return;

		requests = res.data.map((it) => ({
			id: it.id,
			user: it.username,
			from: it.pickupNode,
			to: it.dropoffNode
		}));
	})

	let accept = async (requestId: string) => {
		const { id } = jwtDecode<{ id: string }>(localStorage.getItem("token")!)
		const res = await api.post("api/driver/requests/" + requestId + "/accept?driverId=" + id)

		if (res.status !== 200) {
			alert("Failed to accept request")
			return;
		}

		alert("Accepted " + JSON.stringify(res.data))
		alert("Waiting two seconds...")

		setTimeout(async () => complete(requestId), 2000)
	}

	let deny = async (requestId: string) => {
		const { id } = jwtDecode<{ id: string }>(localStorage.getItem("token")!)
		const res = await api.post("api/driver/requests/" + requestId + "/deny?driverId=" + id)

		if (res.status !== 200) {
			alert("Failed to deny request")
			return;
		}

		alert("Accepted " + JSON.stringify(res.data))
	}

	let complete = async (requestId: string) => {
		const { id } = jwtDecode<{ id: string }>(localStorage.getItem("token")!)
		const res = await api.post("api/driver/requests/" + requestId + "/complete?driverId=" + id)

		if (res.status !== 200) {
			alert("Failed to complete request")
			return;
		}

		alert("Completed " + JSON.stringify(res.data))

		await getFuel();
	}

	let fuelPercent = $state(0.0)

	let getFuel = async () => {
		// -s http://localhost:8080/api/driver/69bc02c6a72fc0b3dad6e642/status \
		const { id } = jwtDecode<{ id: string }>(localStorage.getItem("token")!)
		const res = await api.get("api/driver/" + id + "/status") as AxiosResponse<{
			currentFuel: number;
			maxTank: number;
		}>

		if (res.status !== 200) {
			alert("Failed to fetch fuel")
			return;
		}

		fuelPercent = res.data.currentFuel / res.data.maxTank * 100;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="flex flex-row space-x-10 justify-center">
		<div>
			<UnterMapView onNodeClick={populateForm}/>
			<div class="w-full bg-fuchsia-300 p-5 rounded-b-2xl">
				Fuel left: {fuelPercent.toFixed(2)}%
			</div>
		</div>

		<div class="flex flex-col gap-5 w-110">
			<h1 class="mx-auto font-bold mt-5">REQUESTS</h1>

			{#each requests as request, i (request.id)}
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
