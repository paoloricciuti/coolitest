<script lang="ts">
	import { enhance } from '$app/forms';
	import roughjs from 'roughjs';

	const { data } = $props();

	let live_data = $state([...data.votes.values()]);

	$effect(() => {
		live_data = [...data.votes.values()];
	});

	$effect(() => {
		const event_source = new EventSource('/votes', { withCredentials: true });
		function listener(e: MessageEvent) {
			live_data = JSON.parse(e.data);
		}
		event_source.addEventListener('update-votes', listener);
		event_source.addEventListener('open', () => console.log('open'));
		return () => {
			event_source.removeEventListener('update-votes', listener);
		};
	});

	function rough(node: SVGSVGElement, val: typeof live_data) {
		const svg = roughjs.svg(node);
		const rects: Array<SVGElement> = [];
		const width = 80 / val.length;
		const gap = 5;
		const draw_options = {
			fill: '#ff3e00',
			roughness: 0.5,
			preserveVertices: true,
			hachureGap: 1.5
		};
		const back = svg.rectangle(0, 0, 100, 100, {
			fill: 'white',
			fillStyle: 'solid',
			roughness: 0.5,
			preserveVertices: true
		});
		node.appendChild(back);
		for (let i = 0; i < val.length; i++) {
			const value = val[i];
			let rect = svg.rectangle(
				10 + i * width + gap / 2,
				90 - value,
				width - gap,
				value,
				draw_options
			);
			node.appendChild(rect);
			rects.push(rect);
		}
		let line = svg.line(0, 95, 100, 95);
		node.appendChild(line);
		return {
			update(new_val: typeof live_data) {
				console.log(new_val.length);
				for (let i = 0; i < new_val.length; i++) {
					const value = new_val[i];
					let rect = svg.rectangle(
						10 + i * width + gap / 2,
						90 - value,
						width - gap,
						value,
						draw_options
					);
					node.replaceChild(rect, rects[i]);
					rects.splice(i, 1, rect);
				}
			}
		};
	}
</script>

<div>
	<svg use:rough={live_data} viewBox="0 0 100 100"></svg>
	<form class="voter" method="post" use:enhance>
		{#each [1, 2, 3] as vote}
			<button name="vote" value={vote}>{vote}</button>
		{/each}
	</form>
</div>

<style>
	.voter {
		display: flex;
		justify-content: space-evenly;
	}
	svg,
	form {
		max-width: min(40rem, 90%);
		margin: auto;
		display: block;
	}
</style>
