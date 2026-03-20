<script lang="ts">
	import Circle from '$lib/circle.svelte';
	import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';
	import api from '$lib/api.ts';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	import type { AxiosResponse } from 'axios';

	let state:
		{ state: "requesting", from: string, to: string } |
		{ state: "pending" } |
		{ state: "accepted" } = $state({ state: "requesting", from: "", to: "" });

	onMount(async () => {
		const { sub } = jwtDecode<{ sub: string }>(localStorage.getItem('token')!);
		const res = await api.get('/api/customer/requests?username=' + sub) as AxiosResponse<{ status: string }[]>;

		if (res.status !== 200) {
			alert("Something went wrong. Please try again later.");
			return;
		}

		const hasPendingRequest = res.data.some(it => it.status !== "COMPLETED" && it.status !== "NO_DRIVERS_AVAILABLE");
		if (hasPendingRequest)
			state = { state: "pending" };
	})

	const finish = async () => {
		if (state.state !== "requesting")
			return;

		// Error handling
		if (state.from === "" || state.to === "")
			return alert("Please fill in both the 'from' and 'to' fields before submitting the form.");
		if (state.from === state.to)
			return alert("You can't ride to the same place! Please choose a different destination.");

		// Get ID from token
		const { sub } = jwtDecode<{ sub: string }>(localStorage.getItem('token')!);

		// Make request
		const res = await api.post('/api/customer/requests', {
			username: sub,
			pickUpNode: state.from,
			dropOffNode: state.to,
			graphName: localStorage.getItem('graphName')!,
		});

		// Handle response
		if (res.status !== 201)
			return alert("Something went wrong. Please try again later.");

		state = { state: "pending" };
	}

	const populateForm = (node: UnterMapNode) => {
		if (state.state !== "requesting")
			return;

		if (state.from === "")
			state.from = node.name;
		else if (state.to === "")
			state.to = node.name;
		else {
			state.from = "";
			state.to = "";
			populateForm(node);
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="flex w-110 flex-col mx-auto">
		<UnterMapView onNodeClick={populateForm}/>

		{#if state.state === "requesting"}
			<div class="h-fit px-10 bg-amber-300 p-5 rounded-b-3xl shadow-2xl">
				<h1 class="text-center mx-auto font-bold">Where to?</h1>

				<form id="ride-form" onsubmit={finish} class="flex flex-col gap-2 mt-2 text-center">
					<div class="flex flex-row justify-center items-center gap-2">
						<div>
							<p class="mb-1 italic">from</p>
							<Circle value={state.from}/>
						</div>
						<p class="text-2xl mt-6 font-bold">→</p>
						<div>
							<p class="mb-1 italic">to</p>
							<Circle value={state.to}/>
						</div>
					</div>

					<button onclick={finish} class="blue-button mt-2 w-40 mx-auto" type="submit" form="sisu-form" value="Submit">
						Request a ride!
					</button>
				</form>
			</div>
		{:else if state.state === "pending"}
			<div class="h-fit px-10 bg-amber-300 p-5 rounded-b-3xl text-center shadow-2xl">
				<h1 class="font-bold">Where to?</h1>

				<p>You've made a request!</p>
				<p>Sit tight while our drivers accept your request.</p>
			</div>
		{:else if state.state === "accepted"}
			<div class="h-fit px-10 bg-green-300 p-5 rounded-b-3xl text-center shadow-2xl">
				<h1 class="font-bold">Where to?</h1>

				<p>Your request is accepted!</p>
			</div>
		{/if}
	</div>
</section>
