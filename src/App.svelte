<script lang="ts">
import { onMount } from "svelte";
import { Level } from './level';
import { World } from './world';

export let name: string;

onMount(async () => {
	const world = new World();
	await world.init();
	world.start();
	Level.create(world);

	setInterval(update, 20);

	function update() {
		world.update();
		world.render();
	}

});
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<div id="game"></div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>