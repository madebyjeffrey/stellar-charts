<script lang="ts">
	import { CategoryAxis, type ChartModel, PiecewiseAxis } from '$lib/chart.model';
	import { afterUpdate, onMount } from 'svelte';

	type Rect = {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	export let model: ChartModel;

	const width = 500;
	const height = 400;

	let testValue1: string;
	let testValue2: string;
	let updateRequired: boolean = false;

	let testValue1Element: SVGTextElement;
	let testValue2Element: SVGTextElement;
	let chartTitleElement: SVGTextElement;

	let chartHasMeasurements: boolean = false;
	let chartAreaTop: number;
	let chartAreaBottom: number;
	let chartAreaLeft: number;
	let chartAreaRight: number;
	let chartAreaWidth: number;
	let chartAreaHeight: number;
	let xAxisTitleBottom: number;
	let axisLabelHeight: number;

	let categoryAxis: CategoryAxis<number> | null;
	let pieceWiseAxis: PiecewiseAxis | null;
	let dataLine: string | null = null;

	const yTickLength = 5; // on either side of the y-axis
	const xTickLength = 5;

	const colourForRange = (y: number) =>  y <= 100 ? '#000' : '#F00';
	const colourForDomain = (x: number) => x === model.freeXValue ? '#5754AC' : '#000';

	// we have to calculate where the chart elements are going to be
	// for that we need to know the size of various font elements
	onMount(() => {
		const largestYLabel = model.yAxisValues
			.map(model.yAxisValueLabel)
			.map((value, index) => ({ length: value.length, index }))
			.reduce((previousValue, currentValue) => currentValue.length < previousValue.length
				? previousValue
				: currentValue, { length: Number.MIN_VALUE, index: Number.MIN_VALUE});

		const largestXLabel = model.xAxisValues
			.map(model.xAxisValueLabel)
			.map((value, index) => ({ length: value.length, index }))
			.reduce((previousValue, currentValue) => currentValue.length < previousValue.length
				? previousValue
				: currentValue, { length: Number.MIN_VALUE, index: Number.MIN_VALUE});

		testValue1 = model.yAxisValueLabel(model.yAxisValues[largestYLabel.index]);
		testValue2 = model.xAxisValueLabel(model.xAxisValues[largestXLabel.index]);

		updateRequired = true;
	});

	afterUpdate(() => {
		if (!updateRequired) {
			return;
		}

		updateRequired = false;

	// JFC the definition is wrong! so we are using a narrower type
		const yAxisBoxMeasure: Rect = testValue1Element.getBBox();
		const xAxisBoxMeasure: Rect = testValue2Element.getBBox();
		const titleBoxMeasure: Rect = chartTitleElement.getBBox();

		axisLabelHeight = yAxisBoxMeasure.height;

		console.log(titleBoxMeasure, titleBoxMeasure.height, titleBoxMeasure.y);

		chartAreaTop = titleBoxMeasure.height + titleBoxMeasure.y;
		chartAreaBottom = height - (xAxisBoxMeasure.height + titleBoxMeasure.height + 10);
		chartAreaLeft = yAxisBoxMeasure.width;
		chartAreaRight = width - 10;
		chartAreaHeight = chartAreaBottom - chartAreaTop;
		chartAreaWidth = chartAreaRight - chartAreaLeft;

		// note, coordinates on text elements specify the bottom left spot
		xAxisTitleBottom = chartAreaBottom + xAxisBoxMeasure.height * 2;

		categoryAxis = new CategoryAxis(model.xAxisValues, [chartAreaLeft, chartAreaRight]);
		pieceWiseAxis = new PiecewiseAxis(model.yAxisRangeValues, [chartAreaTop, chartAreaBottom]);

		for (let value of model.yAxisRangeValues) {
			console.log(value, pieceWiseAxis.rangeValue(value));
		}

		console.log(pieceWiseAxis.rangeValue(12));

		dataLine = model.data.map(({ x, y }) => `${Math.round(categoryAxis!.centre(x) + chartAreaLeft)},${Math.round(chartAreaBottom - pieceWiseAxis!.rangeValue(y))}`).join(" ");

		console.log(dataLine);

		chartHasMeasurements = true;
	});

</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width={width} height={height} class="warp-chart ml-4 border border-red-300">
	<text bind:this={testValue1Element} class="test-value-1 axis" x="20" y="20">{testValue1}</text>
	<text bind:this={testValue2Element} class="test-value-2 axis" x="20" y="40">{testValue2}</text>
	<text bind:this={chartTitleElement} class="title" x={width/2} y="20">{model.title}</text>

	 {#if chartHasMeasurements && categoryAxis != null && pieceWiseAxis != null}
		<line x1={chartAreaLeft} y1={chartAreaTop} x2={chartAreaLeft} y2={chartAreaBottom} class="axis-line" />
		<line x1={chartAreaLeft} y1={chartAreaBottom} x2={chartAreaRight} y2={chartAreaBottom} class="axis-line" />
		<text x={chartAreaWidth/2 + chartAreaLeft} y={xAxisTitleBottom + 3} class="title">{model.xAxisTitle}</text>

		<!--{#each model.yAxisValues as value, i}-->
		<!--	<text text-anchor="end" x={chartAreaLeft - yTickLength - 1} y={chartAreaBottom - (i+1)*yAxisBoxHeight + axisLabelHeight / 3} class="axis">{model.yAxisValueLabel(value)}</text>-->
		<!--	<line x1={chartAreaLeft - yTickLength} y1={chartAreaBottom - (i+1)*yAxisBoxHeight} x2={chartAreaLeft + yTickLength} y2={chartAreaBottom - (i+1)*yAxisBoxHeight} class="axis-line"/>-->
		<!--{/each}-->

		 {#each model.yAxisValues as value, i}
			 <text text-anchor="end" x={chartAreaLeft - yTickLength - 1} y={chartAreaBottom - pieceWiseAxis.rangeValue(value) + axisLabelHeight / 3} class="axis" fill={colourForRange(value)}>{model.yAxisValueLabel(value)}</text>
			 <line x1={chartAreaLeft - yTickLength} y1={chartAreaBottom - pieceWiseAxis.rangeValue(value)} x2={chartAreaLeft + yTickLength} y2={chartAreaBottom - pieceWiseAxis.rangeValue(value)} class="axis-line"/>
		 {/each}

		{#each model.xAxisValues as value}
			<text text-anchor="middle" x={categoryAxis.centre(value) + chartAreaLeft} y={chartAreaBottom + axisLabelHeight + 3} class="axis" fill={colourForDomain(value)}>{model.xAxisValueLabel(value)}</text>
			<line x1={categoryAxis.centre(value) + chartAreaLeft} y1={chartAreaBottom - xTickLength} x2={categoryAxis.centre(value) + chartAreaLeft} y2={chartAreaBottom + xTickLength} class="axis-line"/>
		{/each}


		 <line x1={chartAreaLeft} x2={chartAreaLeft+chartAreaWidth} y1={chartAreaBottom - pieceWiseAxis.rangeValue(100)} y2={chartAreaBottom - pieceWiseAxis.rangeValue(100)} class="axis-line"/>

		 {#if model.highlightMinRange}
			 <rect x={categoryAxis.min(model.highlightMinRange) + chartAreaLeft}	y={chartAreaTop} width={categoryAxis.bandwidth()} height={chartAreaHeight-1} fill="#D3D88D" />
		 {/if}

		 {#if dataLine}
			<polyline points={dataLine} fill="none" stroke="blue"/>
		 {/if}

	{/if}
</svg>

<style>
		.warp-chart .test-value-1, .warp-chart .test-value-2 {
				visibility: hidden;
    }

	.warp-chart text.axis  {
		font: normal 12px "B612 Mono";
  }

	.warp-chart text.title {
			font: normal 12px "B612 Mono";
      text-anchor: middle;
  }

	.warp-chart .axis-line {
			stroke: black;
			stroke-width: 1px;
  }
</style>