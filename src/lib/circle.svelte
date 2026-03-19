<script lang="ts">
	const { value }: { value: string } = $props();
</script>

<div class="rounded-full size-12 bg-white border flex items-center justify-center text-xs" id="to">
	{value}
</div>