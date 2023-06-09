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

	const languages =
		'Date,Abap,Ada,C#,Cobol,Dart,Go,Groovy,Haskell,Java,JavaScript,Kotlin,Lua,Matlab,Objective-C,Perl,PHP,Powershell,Python,R,Ruby,Rust,Scala,Swift,TypeScript,VBA'.split(
			','
		);

	let project = {
		name: 'History and Evolution of Computer Programming Languages',
		description:
			'This project is about the history and evolution of computer programming languages.',
		updates: 'Latest update: Added a new section about the evolution of JavaScript.'
	};
	export let data: { languages: string[]; chartData: { [name: string]: any[][] } };
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

	let labels = [...new Set(Object.values(data?.chartData)?.[0].map((x) => x[0]))];

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
	$: console.log(data);
	let inputChipE: InputChip;
</script>

<main class="seco">
	<!-- @ts-ignore -->
	<InputChip
        
		bind:this={inputChipE}
		bind:input={inputChip}
		bind:value={inputChipList}
		name="chips"
		whitelist={flavorOptions.map(({ value }) => String(value))}
	/>
	<div
		class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto h-72"
		tabindex="-1"
	>
		<Autocomplete
			bind:input={inputChip}
			options={flavorOptions}
			denylist={inputChipList}
			on:selection={onInputChipSelect}
		/>
	</div>
	<button
		on:click={() => {
			console.log(
				'/timeline?' +
					new URLSearchParams({
						languages: inputChipList.join(',')
					})
			);

			// let query = new URLSearchParams($page?.url.toString());

			// query.set('word', word);
			$page.url.searchParams.set('languages', inputChipList.join(','));

			goto(`?${$page.url.searchParams.toString()}`, { invalidateAll: true, replaceState: true });
			// invalidate(`?${$page.url.searchParams.toString()}`)
		}}
		type="button"
		class="btn variant-filled">Button</button
	>
	{#key data.chartData}
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
				labels,
				// datasets:[
				//     {
				//         backgroundColor : '',
				//         borderColor: '',

				//     }
				// ]
				datasets: Object.entries(data.chartData).map((point) => ({
					label: point[0],
					data: labels.map((x) => point[1].find((val) => val[0] == x)?.[2] ?? 0)
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
