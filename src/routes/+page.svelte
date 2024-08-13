<script lang="ts">
	import { engines } from '$lib/engines';
	import { type ChartModel } from '$lib/chart.model';
	import { onMount } from 'svelte';
	import Chart from  "$lib/components/chart.svelte";

	let selected = engines[0].key;

	let chartData: ChartModel | null = null;

	function handleSelectedEngine() {
		console.log(selected);
	}

	onMount(() => {
		chartData = {
			title: "Fuel Usage vs. Warp Speed",
			yAxisRange: [0, 1000],
			yAxisValues: [25, 50, 100, 200, 400, 800],
			yAxisRangeValues: [25, 50, 100, 200, 400, 800, 1200],
			xAxisValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			xAxisTitle: "Warp",
			xAxisValueLabel: (value: number) => {
				return String(value);
			},
			yAxisValueLabel: (value: number) => {
				return `${value}%`;
			},
			data: engines.find(x => x.key === selected)!.fuelUsage.map((d, i) => ({ x: i, y: d })),
			highlightMinRange: engines.find(x => x.key === selected)!.maxSafeSpeed + 1,
			freeXValue: engines.find(x => x.key === selected)!.idealSpeed,
		};
	});
</script>

<h1>Stellar Charts</h1>

<span>Select Engine</span>
<select bind:value={selected} on:change={handleSelectedEngine} class="select">
	{#each engines as engine (engine.key)}
		<option value={engine.key}>{engine.name}</option>
	{/each}
</select>

{#if chartData != null}
	<Chart model={chartData}/>
{/if}