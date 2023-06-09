/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch ,url }) {
    params;
    
    return {
        languages: url.searchParams.get('languages')?.split(',')?.filter(x => x),
        chartData: await (await fetch('/api/timelinedata?'+new URLSearchParams({
            languages: url.searchParams.get('languages') ?? '',
            yearStart: url.searchParams.get('yearStart') ?? '-Infinity',
            yearEnd: url.searchParams.get('yearEnd') ?? 'Infinity',
        }))).json()

    };
}