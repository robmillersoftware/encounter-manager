/**
* This file contains all classes associated with the Campaign object
* @author Rob Miller
* @copyright 2018
*/
import { Character, Location, Player, PlayerFactory, Encounter, Game, GameFactory } from '@shared/objects';

/**
* This interface is used to construct Campaign objects
*/
interface CampaignData {
  name: string,
  game: Game,
  description: string,
  gm?: Player,
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
  public game: Game;
  public description: string;
  public gm: Player;
  public characters: Array<Character>;
  public locations: Array<Location>;
  public players: Array<Player>;
  public encounterHistory: Array<Encounter>;
  public currentEncounters: Array<Encounter>;
  public activeEncounter: Encounter;

  constructor(data: CampaignData) {
    console.log("Building campaign: " + JSON.stringify(data));
    //The first three fields are all required and can't be null
    this.name = data.name;
    this.game = data.game;
    this.description = data.description;
    this.gm = data.gm;

    if (data.hasOwnProperty('characters') && data.characters != null) {
      this.characters = data.characters;
    } else {
      this.characters = new Array<Character>();
    }

    if (data.hasOwnProperty('locations') && data.locations != null) {
      this.locations = data.locations;
    } else {
      this.locations = new Array<Location>();
    }

    if (data.hasOwnProperty('players') && data.players != null) {
      this.players = data.players;
    } else {
      this.players = new Array<Player>();
    }

    if (data.hasOwnProperty('encounterHistory') && data.encounterHistory != null) {
      this.encounterHistory = data.encounterHistory;
    } else {
      this.encounterHistory = new Array<Encounter>();
    }

    if (data.hasOwnProperty('currentEncounters') && data.currentEncounters != null) {
      this.currentEncounters = data.currentEncounters;
    } else {
      this.currentEncounters = new Array<Encounter>();
    }

    this.activeEncounter = data.hasOwnProperty('activeEncounter') ? data.activeEncounter : null;
  }
}

/**
* Nearby advertisements have strict size limitations. This class represents a compact version
* of a campaign object that only provides the absolutely necessary details and uses non-user-friendly
* naming conventions
*/
class CampaignBroadcast {
  /**
  * @param n the name of the campaign
  * @param g the game
  * @param d brief description
  * @param gm the name of the gm
  */
  constructor(public n: string, public g: string, public d: string, public gm: string) {}
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
  static createCampaign(name: string, game: Game, description: string, gm?: Player, characters?: Array<Character>,
      locations?: Array<Location>, players?: Array<Player>): Campaign {
    return new Campaign({name: name, game: game, description: description, gm: gm, characters: characters,
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
    return JSON.stringify(new CampaignBroadcast(campaign.name, campaign.game.name, campaign.description, campaign.gm.name));
  }

  /**
  * Parses a CampaignBroadcast string to a Campaign object
  * @param broadcast
  * @return parsed Campaign
  */
  static fromBroadcast(broadcast: string): Campaign {
    let b = <CampaignBroadcast>JSON.parse(broadcast);
    return new Campaign({name: b.n, game: GameFactory.buildGame(b.g), description: b.d, gm: PlayerFactory.createPlayer(b.gm, null)});
  }
}
