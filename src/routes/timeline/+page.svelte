<!-- src/routes/index.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Colors
	} from 'chart.js';
	import { goto, invalidate } from '$app/navigation';
	import type { dataType } from './+page';
	import { writable } from 'svelte/store';
	import { GlobalState } from '$lib/store/mainStore';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Colors
	);

	interface EventListener {
		update(value: any, type?: string): void;
	}

	class EventManager {
		private listeners: { [eventType: string]: EventListener[] };

		constructor() {
			this.listeners = {};
		}

		subscribe(eventType: string, listener: EventListener) {
			this.listeners[eventType] = [...(this.listeners[eventType] ?? []), listener];
		}

		unsubscribe(eventType: string, listener: EventListener) {
			this.listeners[eventType]?.splice(this.listeners[eventType].indexOf(listener), 1);
		}

		notify(eventType: string, data: any) {
			this.listeners[eventType].forEach((listener) => listener.update(data, eventType));
		}
	}

	class Editor {
		events: EventManager;
		constructor() {
			this.events = new EventManager();
		}

		updataData(data: dataType) {
			this.events.notify('yearStart', data.yearStart);
			this.events.notify('yearEnd', data.yearEnd);
		}

		updateYearStart(value: number) {
			this.events.notify('yearStart', value);
		}

		updateYearEnd(value: number) {
			this.events.notify('yearEnd', value);
		}
	}

	class YearStartListener implements EventListener {
		minValue: number;
		maxValue: number;
		yearStart: number;
		constructor(minValue: number, maxValue: number, yearStart?: number) {
			this.minValue = minValue;
			this.maxValue = maxValue;
			this.yearStart = yearStart ?? minValue;
		}

		update(value: any): void {
			console.log(value);

			this.yearStart = value;
		}
	}

	class YearEndListener implements EventListener {
		minValue: number;
		maxValue: number;
		yearEnd: number;
		constructor(minValue: number, maxValue: number, yearEnd?: number) {
			this.minValue = minValue;
			this.maxValue = maxValue;
			this.yearEnd = yearEnd ?? maxValue;
		}

		update(value: any): void {
			console.log(value);

			this.yearEnd = value;
		}
	}

	class LabelsListener implements EventListener {
		yearStart: number;
		yearEnd: number;
		labels: number[];
		constructor(minValue: number, maxValue: number, yearStart?: number, yearEnd?: number) {
			this.yearStart = yearStart ?? minValue;
			this.yearEnd = yearEnd ?? maxValue;
			this.labels = [];
		}

		update(value: any, type?: 'yearStart' | 'yearEnd'): void {
			this[type ?? 'yearStart'] = value;
			this.labels = range(this.yearStart, this.yearEnd);
			console.log(this.labels);
		}
	}

	export let data: dataType;
	onMount(()=>{
		if (!data.languages) {
			
		}		
	})
	const editor = new Editor();
	const yearEndListener = new YearEndListener(2008, 2018, Number(data.yearEnd));
	const yearStartListener = new YearStartListener(2008, 2018, Number(data.yearStart));
	const labelsListener = new LabelsListener(
		2008,
		2018,
		Number(data.yearStart),
		Number(data.yearEnd)
	);
	editor.events.subscribe('yearStart', yearStartListener);
	editor.events.subscribe('yearEnd', yearEndListener);
	editor.events.subscribe('yearStart', labelsListener);
	editor.events.subscribe('yearEnd', labelsListener);
	$: if (data) editor.updataData(data);

	const languages =
		'Date,Abap,Ada,C#,Cobol,Dart,Go,Groovy,Haskell,Java,JavaScript,Kotlin,Lua,Matlab,Objective-C,Perl,PHP,Powershell,Python,R,Ruby,Rust,Scala,Swift,TypeScript,VBA'
			/***/ .split(',');

	let inputChip = '';
	let inputChipList =
		data?.languages ??
		languages
			.map((x) => x.toLocaleLowerCase())
			.filter((x) => Object.keys(data.chartData).includes(x));
	let flavorOptions: AutocompleteOption[] = languages.map((value) => ({
		label: value,
		value: value.toLocaleLowerCase().replaceAll(' ', '')
	}));
	// onMount(async () => {
	// 	// let loadingPromise = new Promise(async (resolve) => {
	// 	// 	resolve(await (await fetch('/timelinedata')).json());
	// 	// });
	// 	chartData = ;
	// });

	function onInputChipSelect(event: any): void {
		console.log('onInputChipSelect', event.detail);
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
		}
	}
	function range(start: number, end: number) {
		start = Number(start);
		end = Number(end) + 1;
		return Array.from({ length: end - start }, (v, k) => k + start);
	}

	function rerender() {
		// let query = new URLSearchParams($page?.url.toString());

		// query.set('word', word);
		$page.url.searchParams.set('languages', inputChipList.join(','));
		GlobalState.getInstance().set('languages', inputChipList.join(','))

		$page.url.searchParams.set('yearStart', String(yearStartListener.yearStart));
		GlobalState.getInstance().set('yearStart', String(yearStartListener.yearStart))

		$page.url.searchParams.set('yearEnd', String(yearEndListener.yearEnd));
		GlobalState.getInstance().set('yearEnd', String(yearEndListener.yearEnd));

		goto(`?${$page.url.searchParams.toString()}`, { invalidateAll: true, replaceState: true });
		// invalidate(`?${$page.url.searchParams.toString()}`)
	}
</script>

<main class="seco">
	<!-- @ts-ignore -->
	<InputChip
		bind:input={inputChip}
		bind:value={inputChipList}
		name="chips"
		whitelist={flavorOptions.map(({ value }) => String(value))}
	/>
	<div class="flex">
		<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto h-72" tabindex="-1">
			<Autocomplete
				bind:input={inputChip}
				options={flavorOptions}
				denylist={inputChipList}
				on:selection={onInputChipSelect}
			/>
		</div>
		<div>
			<span>From year</span>
			<input
				on:change={({ target }) => editor.updateYearStart(target?.valueAsNumber)}
				value={yearStartListener.yearStart}
				class="input"
				type="number"
				placeholder="Input"
				min="2008"
				max={yearEndListener.yearEnd}
			/>
		</div>
		<div>
			<span>To year</span>
			<input
				on:change={({ target }) => editor.updateYearEnd(target?.valueAsNumber)}
				value={yearEndListener.yearEnd}
				class="input"
				type="number"
				placeholder="Input"
				min={yearStartListener.yearStart}
				max="2018"
			/>
		</div>
	</div>
	<button on:click={rerender} type="button" class="btn variant-filled">Apply</button>
	{#key data}
		<Line
			height="100%"
			options={{
				// plugins: {
				// 	customCanvasBackgroundColor: {
				// 		color: 'rgba(255,10,13,0.3)'
				// 	}
				// },
				responsive: true
				// borderColor: 'white'
				// backgroundColor: "rgba(255,10,13,0.3)"
			}}
			data={{
				labels: labelsListener.labels,
				// datasets:[
				//     {
				//         backgroundColor : '',
				//         borderColor: '',

				//     }
				// ]
				datasets: Object.entries(data.chartData).map((point) => ({
					label: point[0],
					data: labelsListener.labels.map((x) => point[1].find((val) => val[0] == x)?.[2] ?? NaN)
					// backgroundColor: 'color-success-500',
					// {
					//     const ent = point[1].find(val=>val[0] == x)?.[2] ?? 0
					//     console.log(ent);
					//     return ent?.[2] ?? 0
					//     // return ent ? ent[2] / ent[3]: 0
					// })
					// pointBorderColor : 'white'
				}))
			}}
		/>
	{/key}
</main>
