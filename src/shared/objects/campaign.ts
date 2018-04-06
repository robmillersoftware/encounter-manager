import { Character, Location, Player, Encounter } from '@shared/objects';
import { Globals } from '@globals';

interface CampaignData {
    name: string,
    description: string,
    characters?: Array<Character>,
    locations?: Array<Location>,
    players?: Array<Player>,
    encounterHistory?: Array<Encounter>;
    currentEncounters?: Array<Encounter>;
    activeEncounter?: Encounter;
}

export class Campaign {
  public name: string;
  public description: string;
  public characters: Array<Character>;
  public locations: Array<Location>;
  public players: Array<Player>;
  public encounterHistory: Array<Encounter>;
  public currentEncounters: Array<Encounter>;
  public activeEncounter: Encounter;

  constructor(data: CampaignData) {
    console.log("building campaign: " + JSON.stringify(data));
    this.name = data.name;
    this.description = data.description;
    this.characters = data.hasOwnProperty('characters') ? data.characters : new Array<Character>();
    this.locations = data.hasOwnProperty('locations') ? data.locations : new Array<Location>();
    this.players = data.hasOwnProperty('players') ? data.players: new Array<Player>();
    this.encounterHistory = data.hasOwnProperty('encounterHistory') ? data.encounterHistory : new Array<Encounter>();
    this.currentEncounters = data.hasOwnProperty('currentEncounters') ? data.currentEncounters : new Array<Encounter>();
    this.activeEncounter = data.hasOwnProperty('activeEncounter') ? data.activeEncounter : null;
  }
}

class CampaignBroadcast {
  public token: string;

  constructor(public n: string, public d: string) {
    this.token = Globals.connectionToken;
  }
}

export class CampaignFactory {
  static createCampaign(name: string, description: string, characters?: Array<Character>,
      locations?: Array<Location>, players?: Array<Player>) {
    return new Campaign({name: name, description: description, characters: characters,
      locations: locations, players: players});
  }

  static fromJSON(json: string) {
    return new Campaign(<CampaignData>JSON.parse(json));
  }

  static toBroadcast(campaign: Campaign): string {
    return JSON.stringify(new CampaignBroadcast(campaign.name, campaign.description));
  }

  static fromBroadcast(broadcast: string): Campaign {
    let b = <CampaignBroadcast>JSON.parse(broadcast);
    return new Campaign({name: b.n, description: b.d});
  }

  static getGm(c: Campaign): Player {
    for (let p of c.players) {
      if (p.isGm) {
        return p;
      }
    }

    return null;
  }
}
