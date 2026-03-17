<script lang="ts">
	import { onMount } from 'svelte';
	import { call, request } from '$lib/request.ts';

	type Role = "CUSTOMER" | "DRIVER";
	type State = "SIGN_IN" | "SIGN_UP";

	let state: State = $state("SIGN_IN");
	let role: Role = $state("CUSTOMER")

	function finish() {
		const usernameElement = document.getElementById("username") as HTMLInputElement
		const passwordElement = document.getElementById("password") as HTMLInputElement
		const email = usernameElement.value;
		const password = passwordElement.value;

		if (state == "SIGN_IN") {
			alert("Sign in")
			call("auth/login?email=" + email + "&password=" + password, "POST")
		}
		else {
			alert("Sign up")
			call("auth/register?email=" + email + "&password=" + password + "&role=" + role, "POST")
		}
	}

	function switchState() {
		state = state === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN";
	}

	onMount(() => {
		request<number[]>("/routing/calculate?start=A&end=D").then(console.log);
	})
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

		{#if state === "SIGN_UP"}
			<div class="w-[90%] mx-auto mt-3 space-y-2 text-center">
				<p>I want to be a...</p>
				<div class="flex justify-stretch">
					{#if role === "CUSTOMER"}
						<button type="button" class="w-1/2 rounded-r-2xl outline-4 outline-blue-200 mr-0" style="border-radius: 0; border-top-left-radius: 50px; border-bottom-left-radius: 50px" onclick={() => { role = "CUSTOMER" }}>Customer</button>
					{:else}
						<button type="button" class="w-1/2 rounded-r-2xl mr-0 outline-4" style="border-radius: 0; border-top-left-radius: 50px; border-bottom-left-radius: 50px" onclick={() => { role = "CUSTOMER" }}>Customer</button>
					{/if}

					{#if role === "DRIVER"}
						<button type="button" class="w-1/2 rounded-r-2xl outline-4 outline-blue-200 ml-0" style="border-radius: 0; border-top-right-radius: 50px; border-bottom-right-radius: 50px" onclick={() => { role = "DRIVER" }}>Driver</button>
					{:else}
						<button type="button" class="w-1/2 rounded-r-2xl ml-0" style="border-radius: 0; border-top-right-radius: 50px; border-bottom-right-radius: 50px" onclick={() => { role = "DRIVER" }}>Driver</button>
					{/if}
				</div>
			</div>
		{/if}

		<button class="mt-3" type="submit" form="sisu-form" value="Submit">Submit</button>
	</form>

	<a href={null} onclick={() => switchState()} class="text-center mx-auto text-sm mt-2 cursor-pointer">
		Want to sign {{ "SIGN_IN": "up", "SIGN_UP": "in" }[state]} instead?
	</a>
</section>