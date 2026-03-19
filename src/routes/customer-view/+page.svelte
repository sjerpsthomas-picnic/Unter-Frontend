<script lang="ts">
	import Circle from '$lib/circle.svelte';
import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';
	import axios, { type AxiosResponse } from 'axios';
	import api from '$lib/api.ts';

	let currentRequest: { from: string; to: string } = $state({ from: "", to: "" });

	const finish = async () => {
		if (currentRequest.from === "" || currentRequest.to === "")
			return alert("Please fill in both the 'from' and 'to' fields before submitting the form.");

		if (currentRequest.from === currentRequest.to)
			return alert("You can't ride to the same place! Please choose a different destination.");

		const res = await api.post('/api/requests', {
			customerId: "123456789",
			description: "",
			status: "",
			pickUpLocation: { nodeName: currentRequest.from },
			dropOffLocation: { nodeName: currentRequest.to },
		}) as AxiosResponse<object>;

		if (res.status !== 200)
			return alert("Something went wrong. Please try again later.");
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
	</div>
</section>
