export class Globals {
    public static campaignTiles: Array<Object> = [
        {title: 'Resume', image: '', data: {changeTab: true, tabName: 'campaign'}},
        {title: 'Join', image: '', data: { state: 'join', page: 'campaign' }},
        {title: 'New', image: '', data: { state: 'new', page: 'campaign' }},
        {title: 'Load', image: '', data: { state: 'load', page: 'campaign' }}
    ];

    public static characterTiles: Array<Object> = [
        {title: 'Create', image: '', data: { state: 'new', page: 'character' }},
        {title: 'View/Edit', image: '', data: { state: 'edit', page: 'character' }}
    ];

    public static locationTiles: Array<Object> = [
        {title: 'Create', image: '', data: { state: 'new', page: 'location' }},
        {title: 'View/Edit', image: '', data: { state: 'edit', page: 'location' }}
    ];
}

export function debugMap(map: Map<string, any>) {
    console.log(JSON.stringify(Array.from(map.entries()).reduce(
        (json, [key, value]) => {
            console.log('Adding: ' + key + '->' + value);
            json[key] = value;
            return json;
        }, {})
    ));
}