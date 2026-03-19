<script lang="ts">
	import { onMount } from 'svelte';
	import { jwtDecode } from 'jwt-decode';
	import api from '$lib/api.ts';
	import type { AxiosResponse } from 'axios';

	type Role = "CUSTOMER" | "DRIVER";
	type State = "SIGN_IN" | "SIGN_UP";

	let state: State = $state("SIGN_IN");
	let role: Role = $state("CUSTOMER")
	let errorMessage: string = $state("");

	onMount(() => {
		localStorage.removeItem("token");
	})

	async function finish() {
		const usernameElement = document.getElementById("username") as HTMLInputElement
		const passwordElement = document.getElementById("password") as HTMLInputElement
		const email = usernameElement.value;
		const password = passwordElement.value;

		errorMessage = "";

		if (state == "SIGN_IN") {
			const res = await api.post("auth/login", { email, password }) as AxiosResponse<{ token: string }>;

			if (res.status !== 200)
				return errorMessage = (res.data as { message: string }).message + "!";

			const { token } = res.data;

			const role = jwtDecode<{ role: "CUSTOMER" | "DRIVER" }>(token).role;
			localStorage.setItem("token", token);

			if (role === "CUSTOMER")
				window.location.href = "/customer-view";
			else
				window.location.href = "/driver-view";
		}
		else {
			const res = await api.post("auth/register", { email, password, role })

			if (res.status !== 200)
				return errorMessage = (res.data as { message: string }).message + "!";


			const usernameElement = document.getElementById("username") as HTMLInputElement
			const passwordElement = document.getElementById("password") as HTMLInputElement
			usernameElement.value = "";
			passwordElement.value = "";

			state = "SIGN_IN";
		}
	}

	function switchState() {
		state = state === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN";
		errorMessage = "";
	}
</script>

<section class="flex flex-col gap-2 w-[20em] mx-auto my-10">
	<h1 class="text-center mx-auto font-bold">{{ "SIGN_IN": "Sign in", "SIGN_UP": "Sign up" }[state]}</h1>

	<form id="sisu-form" onsubmit={finish} class="flex flex-col gap-2 mt-2">
		<div class="flex justify-between items-center w-[90%] mx-auto">
			<label for="username">Username:</label>
			<input class="rounded-md" type="text" id="username" />
		</div>

		<div class="flex justify-between items-center w-[90%] mx-auto">
			<label for="password">Password:</label>
			<input class="rounded-md" type="password" id="password" />
		</div>

		<p class="text-center mt-2 text-red-500 italic">{errorMessage}</p>

		{#if state === "SIGN_UP"}
			<div class="w-[90%] mx-auto space-y-2 text-center">
				<p>I want to be a...</p>
				<div class="flex justify-stretch">
					{#if role === "CUSTOMER"}
						<button type="button" class="w-1/2 rounded-r-2xl outline-4 outline-blue-500 mr-0" style="border-radius: 0; border-top-left-radius: 50px; border-bottom-left-radius: 50px" onclick={() => { role = "CUSTOMER" }}>Customer</button>
					{:else}
						<button type="button" class="w-1/2 rounded-r-2xl outline-1 outline-blue-500 mr-0" style="border-radius: 0; border-top-left-radius: 50px; border-bottom-left-radius: 50px" onclick={() => { role = "CUSTOMER" }}>Customer</button>
					{/if}

					{#if role === "DRIVER"}
						<button type="button" class="w-1/2 rounded-r-2xl outline-4 outline-blue-500 ml-0" style="border-radius: 0; border-top-right-radius: 50px; border-bottom-right-radius: 50px" onclick={() => { role = "DRIVER" }}>Driver</button>
					{:else}
						<button type="button" class="w-1/2 rounded-r-2xl outline-1 outline-blue-500 ml-0" style="border-radius: 0; border-top-right-radius: 50px; border-bottom-right-radius: 50px" onclick={() => { role = "DRIVER" }}>Driver</button>
					{/if}
				</div>
			</div>
		{/if}

		<button class="blue-button mt-3" type="submit" form="sisu-form" value="Submit">Submit</button>
	</form>

	<a href={null} onclick={() => switchState()} class="text-center mx-auto text-sm mt-2 cursor-pointer">
		Want to sign {{ "SIGN_IN": "up", "SIGN_UP": "in" }[state]} instead?
	</a>
</section>