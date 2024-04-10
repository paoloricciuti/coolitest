<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();

	let live_data = $state(Object.fromEntries(data.votes.entries()));

	$effect(() => {
		live_data = Object.fromEntries(data.votes.entries());
	});

	$effect(() => {
		const event_source = new EventSource('/votes', { withCredentials: true });
		function listener(e: MessageEvent) {
			console.log(e);
			live_data = JSON.parse(e.data);
		}
		event_source.addEventListener('update-votes', listener);
		event_source.addEventListener('open', () => console.log('open'));
		return () => {
			event_source.removeEventListener('update-votes', listener);
		};
	});
</script>

<form method="post" use:enhance>
	{#each [1, 2, 3] as vote}
		<button name="vote" value={vote}>{vote}</button>
	{/each}
</form>
<pre>{JSON.stringify(live_data, null, '	')}</pre>
