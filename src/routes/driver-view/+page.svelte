<script lang="ts">
	import UnterMapView from '$lib/map/unter-map-view.svelte';
	import { type UnterMapNode } from '../../lib/map/unter-map-view.ts';

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
		user: string;
		from: number;
		to: number;
	}

	let requests: Request[] = $state([
		{ user: "user 1", from: 0, to: 2 },
		{ user: "user 2", from: 1, to: 0 },
		{ user: "user 3", from: 2, to: 3 },
		{ user: "user 1", from: 0, to: 2 },
		{ user: "user 2", from: 1, to: 0 },
		{ user: "user 3", from: 2, to: 3 },
	]);

	const finish = () => {}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="flex flex-row space-x-10">
		<UnterMapView onNodeClick={populateForm}/>

		<div class="flex flex-col gap-5 w-full">
			<h1 class="mx-auto font-bold mt-5">REQUESTS</h1>

			{#each requests as request, i (request)}
				<div class="w-full h-fit bg-emerald-300 p-5 rounded-3xl shadow-2xl">
					<div class="text-center text-xl mx-auto font-bold">User '{request.user}' wants to go...</div>

					<form id="ride-form" onsubmit={finish} class="flex flex-col gap-2 mt-2 text-center">
						<div class="flex flex-row justify-center items-center gap-2">
							<div>
								<p class="mb-1 italic">from</p>
								<input class="rounded-full size-12 text-center" disabled type="text" id={`${i}.from`} value={request.from.toString()} />
							</div>
							<p class="text-2xl mt-6 font-bold">→</p>
							<div>
								<p class="mb-1 italic">to</p>
								<input class="rounded-full size-12 text-center" disabled type="text" id={`${i}.to`} value={request.to.toString()} />
							</div>
						</div>

						<div class="flex flex-row justify-center items-center gap-2">
							<button onclick={finish} class="mt-2 w-40 mx-auto" type="submit" form="sisu-form" value="Submit">
								Accept
							</button>

							<button onclick={finish} class="mt-2 w-40 mx-auto" type="submit" form="sisu-form" value="Submit">
								Deny
							</button>
						</div>
					</form>
				</div>
			{/each}
		</div>
	</div>
</section>
