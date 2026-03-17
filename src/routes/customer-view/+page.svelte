<script lang="ts">
	import MapView from '$lib/MapView.svelte';
	import { type MapNode, TEMP_MAP } from '$lib/map.ts';

	const finish = async () => {
		const fromElement = document.getElementById("from") as HTMLInputElement
		const fromValue = fromElement.value.trim();
		const toElement = document.getElementById("to") as HTMLInputElement
		const toValue = toElement.value.trim();

		if (fromValue === "" || toValue === "")
			return alert("Please fill in both the 'from' and 'to' fields before submitting the form.");

		if (fromElement.value === toElement.value)
			return alert("You can't ride to the same place! Please choose a different destination.");

		const asdf = fetch("http://localhost:8080/api/routing/hello", {});
		asdf.then(res => res.text()).then(res => alert(res));
	}

	const populateForm = (node: MapNode) => {
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

		<div class="w-full h-fit bg-amber-300 p-5 rounded-3xl shadow-2xl">
			<h1 class="text-center mx-auto font-bold">Where to?</h1>

			<form id="ride-form" onsubmit={finish} class="flex flex-col gap-2 mt-2 text-center">
				<div class="flex flex-row justify-center items-center gap-2">
					<div>
						<p class="mb-1 italic">from</p>
						<input class="rounded-full size-12 text-center" type="text" id="from" />
					</div>
					<p class="text-2xl mt-6 font-bold">→</p>
					<div>
						<p class="mb-1 italic">to</p>
						<input class="rounded-full size-12 text-center" type="text" id="to" />
					</div>
				</div>

				<button onclick={finish} class="mt-2 w-40 mx-auto" type="submit" form="sisu-form" value="Submit">
					Request a ride!
				</button>
			</form>
		</div>
	</div>
</section>
