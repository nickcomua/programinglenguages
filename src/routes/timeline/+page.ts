import { GlobalState } from "$lib/store/mainStore";

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch, url }) {
    params;
    console.log(GlobalState.getInstance().get('languages'));

    return {
        languages: (url.searchParams.get('languages') ?? GlobalState.getInstance().get('languages'))?.split(',')?.filter((x: string) => x),
        yearStart: url.searchParams.get('yearStart') ?? GlobalState.getInstance().get('yearStart') ?? '2000',
        yearEnd: url.searchParams.get('yearEnd') ?? GlobalState.getInstance().get('yearEnd') ?? '2018',
        chartData: <{ [language: string]: [number, string, number, number][] }>(await (await fetch('/api/timelinedata?' + new URLSearchParams({
            languages: url.searchParams.get('languages') ?? GlobalState.getInstance().get('languages') ?? '',
            yearStart: url.searchParams.get('yearStart') ?? GlobalState.getInstance().get('yearStart') ?? '-Infinity',
            yearEnd: url.searchParams.get('yearEnd') ?? GlobalState.getInstance().get('yearEnd') ?? 'Infinity',
        }))).json())

    };
}

export type dataType = Awaited<ReturnType<typeof load>>