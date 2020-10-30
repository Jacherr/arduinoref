import fetch from 'node-fetch';

export async function searchReference(query: string) {
    const result = await fetch("https://y2y10mz7jy-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.7.0)&x-algolia-api-key=1de4271379988b2cb3d797b07fca6805&x-algolia-application-id=Y2Y10MZ7JY", {
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/x-www-form-urlencoded"
        },
        "body": JSON.stringify({
            "requests": [
                {
                    "indexName": "prod_documentation",
                    "params": `&query=${query}&maxValuesPerFacet=10`
                }
            ]
        }),
        "method": "POST",
    }).then(r => r.json());

    const englishResults = result.results[0].hits.filter((i: any) => i.language === 'en');
    return englishResults;
}