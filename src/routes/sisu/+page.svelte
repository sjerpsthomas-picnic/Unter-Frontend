<script lang="ts">
	function finish() {
		const usernameElement = document.getElementById("username") as HTMLInputElement
		const passwordElement = document.getElementById("password") as HTMLInputElement
		const username = usernameElement.value;
		const password = passwordElement.value;

		alert(`username: ${username}, password: ${password}`);
	}

	type State = "SIGN_IN" | "SIGN_UP"
	let state: State = $state("SIGN_IN");

	function switchState() {
		state = state === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN";
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

		<button class="mt-5" type="submit" form="sisu-form" value="Submit">Submit</button>
	</form>

	<a href={null} onclick={() => switchState()} class="text-center mx-auto text-sm mt-2">
		Want to sign {{ "SIGN_IN": "up", "SIGN_UP": "in" }[state]} instead?
	</a>
</section>