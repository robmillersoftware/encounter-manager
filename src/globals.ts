/**
* Global objects and methods
* @author Rob Miller
* @author robmillersoftware@gmail.com
*/

/**
* This class contains static objects that can be referenced anywhere in the application
*/
export class Globals {
  //This is the service id used for Nearby. New ones should evetually be generated for each build
  public static serviceId: string = "4b89444e-71b7-4fed-90bf-271b8fa1c1b2";
  public static connectionToken: string = "retconnected"
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

/**
* This enum contains the types of broadcasts that can be sent by this application
*/
export enum BroadcastTypes {
  MESSAGE,
  CAMPAIGN
}

/**
* This method is an abstraction for printing a map to the console
* @param map The map to print. Keys must be strings, values can be anything
*/
export function debugMap(map: Map<string, any>): string {
  return JSON.stringify(Array.from(map.entries()).reduce(
    (json, [key, value]) => {
      json[key] = value;
      return json;
  }, {}));
}

export function generateIdentifier(userName: string, id: string, endpoint: string): string {
  return JSON.stringify({n: userName, i: id, e: endpoint});
}

export function parseIdentifier(id: string): any {
  let obj = JSON.parse(id);

  return {userName: obj.n, id: obj.i, endpoint: obj.e};
}
