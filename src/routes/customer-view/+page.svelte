<script lang="ts">
	import Circle from '$lib/circle.svelte';
import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';
	import api from '$lib/api.ts';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';

	let currentRequest: { from: string; to: string } = $state({ from: "", to: "" });

	let requestMade = $state(false);

	onMount(() => {
		// TODO: change to call
		const request = null;

		if (request) {
			requestMade = true;
		}
	})

	const finish = async () => {
		// Error handling
		if (currentRequest.from === "" || currentRequest.to === "")
			return alert("Please fill in both the 'from' and 'to' fields before submitting the form.");
		if (currentRequest.from === currentRequest.to)
			return alert("You can't ride to the same place! Please choose a different destination.");

		// Get ID from token
		const { sub } = jwtDecode<{ sub: string }>(localStorage.getItem('token')!);

		// Make request
		const res = await api.post('/api/customer/requests', {
			username: sub,
			pickUpNode: currentRequest.from,
			dropOffNode: currentRequest.to,
			graphName: localStorage.getItem('graphName')!,
		});

		// Handle response
		if (res.status !== 201)
			return alert("Something went wrong. Please try again later.");

		requestMade = true;
	}

	const populateForm = (node: UnterMapNode) => {
		if (currentRequest.from === "")
			currentRequest.from = node.name;
		else if (currentRequest.to === "")
			currentRequest.to = node.name;
		else {
			currentRequest.from = "";
			currentRequest.to = "";
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

		{#if !requestMade}
			<div class="h-fit px-10 bg-amber-300 p-5 rounded-b-3xl shadow-2xl">
				<h1 class="text-center mx-auto font-bold">Where to?</h1>

				<form id="ride-form" onsubmit={finish} class="flex flex-col gap-2 mt-2 text-center">
					<div class="flex flex-row justify-center items-center gap-2">
						<div>
							<p class="mb-1 italic">from</p>
							<Circle value={currentRequest.from}/>
						</div>
						<p class="text-2xl mt-6 font-bold">→</p>
						<div>
							<p class="mb-1 italic">to</p>
							<Circle value={currentRequest.to}/>
						</div>
					</div>

					<button onclick={finish} class="blue-button mt-2 w-40 mx-auto" type="submit" form="sisu-form" value="Submit">
						Request a ride!
					</button>
				</form>
			</div>
		{:else}
			<div class="h-fit px-10 bg-lime-300 p-5 rounded-b-3xl text-center shadow-2xl">
				<h1 class="font-bold">Where to?</h1>

				<p>You've made a request!</p>
				<p>Sit tight while our drivers accept your request.</p>
			</div>
		{/if}
	</div>
</section>
