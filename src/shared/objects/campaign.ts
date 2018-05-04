/**
* This file contains all classes associated with the Campaign object
* @author Rob Miller
* @copyright 2018
*/
import { Character, Location, Player, Encounter } from '@shared/objects';

/**
* This interface is used to construct Campaign objects
*/
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

/**
* This class represents a campaign. It should be instantiated through the
* CampaignFactory
*/
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
    console.log("Building campaign: " + JSON.stringify(data));
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

/**
* Nearby advertisements have strict size limitations. This class represents a compact version
* of a campaign object that only provides the absolutely necessary details and uses non-user-friendly
* naming conventions
*/
class CampaignBroadcast {
  constructor(public n: string, public d: string) {}
}

/**
* This class is used in the creation and manipulation of Campaign objects
*/
export class CampaignFactory {
  /**
  * Create a Campaign object from the provided variables
  * @param name
  * @param description
  * @param {optional} characters
  * @param {optional} locations
  * @param {optional} players
  * @return newly created Campaign object
  */
  static createCampaign(name: string, description: string, characters?: Array<Character>,
      locations?: Array<Location>, players?: Array<Player>): Campaign {
    return new Campaign({name: name, description: description, characters: characters,
      locations: locations, players: players});
  }

  /**
  * Parses a Campaign object from the given JSON string
  * @param json
  * @return parsed Campaign object
  */
  static fromJSON(json: string): Campaign {
    return new Campaign(<CampaignData>JSON.parse(json));
  }

  /**
  * Converts a Campaign objects to a JSON string broadcast
  * @param campaign
  * @return CampaignBroadcast JSON string
  */
  static toBroadcast(campaign: Campaign): string {
    return JSON.stringify(new CampaignBroadcast(campaign.name, campaign.description));
  }

  /**
  * Parses a CampaignBroadcast string to a Campaign object
  * @param broadcast
  * @return parsed Campaign
  */
  static fromBroadcast(broadcast: string): Campaign {
    let b = <CampaignBroadcast>JSON.parse(broadcast);
    return new Campaign({name: b.n, description: b.d});
  }
}
