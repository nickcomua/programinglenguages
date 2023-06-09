import { TimelineFactory } from '$lib/timelinefactory/index.js';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch }) {
    const languages = (url.searchParams.get('languages') ?? '').split(',').filter(val => val != '');
    const yearStart = Number(url.searchParams.get('yearStart') ?? -Infinity);
    const yearEnd = Number(url.searchParams.get('yearEnd') ?? Infinity);
    const allData = (await (await fetch('/by_tag_year.csv')).text()).split('\n')
        .map(x => x.split(','))
    return json(TimelineFactory(allData, languages, yearStart, yearEnd).getData() ?? []);
}