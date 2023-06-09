
//TimelineFactory
type timeLinePoint = [number, string, number, number]
let mainData: timeLinePoint[]
export function TimelineFactory(allData: string[][], languages: string[], yearStart?: number, yearEnd?: number) {
    mainData = allData.map(([a, b, c, d]) =>
        [Number(a), b, Number(c), Number(d)]
    );
    console.log(languages);

    if (languages.length == 1)
        if ((yearEnd ?? Infinity) - (yearStart ?? -Infinity) == 0) {
            console.log(1);

            return new OneYearOneLanguageTimeline(languages[0], yearStart!)
        }
        else {
            console.log(2);

            return new ManyYearsOneLanguageTimeline(languages[0], yearStart ?? -Infinity, yearEnd ?? Infinity)
        }
    else
        if ((yearEnd ?? Infinity) - (yearStart ?? -Infinity) == 0) {
            console.log(3);

            return new OneYearsManyLanguagesTimeline(languages, yearStart!)
        }
        else {
            console.log(4);

            return new ManyYearsManyLanguagesTimeline(languages, yearStart ?? -Infinity, yearEnd ?? Infinity)
        }
}



interface TimeLine {
    getData(): { [language: string]: timeLinePoint[] }
}

class OneYearOneLanguageTimeline implements TimeLine {
    language
    year
    constructor(language: string, year: number) {
        this.language = language
        this.year = year
    }
    getData() {
        return { [this.language]: mainData.filter(([year, name]) => name == this.language && this.year == year) }
    }
}

class ManyYearsOneLanguageTimeline implements TimeLine {
    language
    yearStart
    yearEnd
    constructor(language: string, yearStart: number, yearEnd: number) {
        this.language = language
        this.yearStart = yearStart
        this.yearEnd = yearEnd
    }
    getData() {
        return {
            [this.language]: mainData.filter(([year, name]) => (name == this.language) && (this.yearStart <= year) && (year <= this.yearEnd))
        }
    }
}

class OneYearsManyLanguagesTimeline implements TimeLine {
    languages
    year
    constructor(languages: string[], year: number) {
        this.languages = languages
        this.year = year
    }
    getData() {
        return mainData.filter(([year, name]) => (this.languages.length != 0 ? this.languages.includes(name) : true) && (this.year == year))
            .reduce((group: { [language: string]: timeLinePoint[] }, point: timeLinePoint) => {
                try {
                    const category = point[1];
                    group[category] = group[category] ?? []
                    // console.log(group);   
                    group[category] = [...group[category], point];
                } catch (error) { }
                return group;
            }, {});
    }
}

class ManyYearsManyLanguagesTimeline implements TimeLine {
    languages
    yearStart
    yearEnd
    constructor(languages: string[], yearStart: number, yearEnd: number) {
        this.languages = languages
        this.yearStart = yearStart
        this.yearEnd = yearEnd
    }
    getData() {
        return mainData.filter(([year, name]) => (this.languages.length != 0 ? this.languages.includes(name) : true) && (this.yearStart <= year) && (year <= this.yearEnd))
            .reduce((group: { [language: string]: timeLinePoint[] }, point: timeLinePoint) => {
                try {
                    const category = point[1];
                    group[category] = group[category] ?? []
                    // console.log(group);   
                    group[category] = [...group[category], point];
                } catch (error) { }
                return group;
            }, {});
    }
}
