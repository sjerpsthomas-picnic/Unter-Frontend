<script lang="ts">
	import MapView from '$lib/MapView.svelte';
	import { type Node, TEMP_MAP } from '../lib/map.ts';

	const finish = () => {
		const fromElement = document.getElementById("from") as HTMLInputElement
		const fromValue = fromElement.value.trim();
		const toElement = document.getElementById("to") as HTMLInputElement
		const toValue = toElement.value.trim();

		if (fromValue === "" || toValue === "")
			return alert("Please fill in both the 'from' and 'to' fields before submitting the form.");

		if (fromElement.value === toElement.value)
			return alert("You can't ride to the same place! Please choose a different destination.");

		alert(`From ${fromValue} to ${toValue}!`)
	}

	const populateForm = (node: Node) => {
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
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="flex flex-row space-x-10">
		<MapView mapNodes={TEMP_MAP} onNodeClick={populateForm}/>

		<div class="w-full bg-amber-300 p-5 rounded-3xl shadow-2xl">
			<h1 class="text-center mx-auto font-bold">Where do you want to go?</h1>

			<form id="ride-form" onsubmit={finish} class="flex flex-col gap-2 mt-2 text-center">
				<label for="from">Current location:</label>
				<input class="rounded-md" type="text" id="from" />
				<label for="to">Destination:</label>
				<input class="rounded-md" type="text" id="to" />

				<button onclick={finish} class="mt-5" type="submit" form="sisu-form" value="Submit">
					Request a ride!
				</button>
			</form>
		</div>
	</div>
</section>
