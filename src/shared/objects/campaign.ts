/**
* This file contains all classes associated with the Campaign object
* @author Rob Miller
* @copyright 2018
*/
import { Character, Location, Player, PlayerFactory, Encounter, Game, GameFactory } from '@shared/objects';
import { SyncObject } from '@networking';

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
  timestamps?: Map<string, number>;
}

/**
* This class represents a campaign. It should be instantiated through the
* CampaignFactory. It extends the SyncObject class, which keeps track of changes to
* fields for data synchronization
*/
export class Campaign extends SyncObject {
  private _name: string;
  private _game: Game;
  private _description: string;
  private _gm: Player;
  private _characters: Array<Character>;
  private _locations: Array<Location>;
  private _players: Array<Player>;
  private _encounterHistory: Array<Encounter>;
  private _currentEncounters: Array<Encounter>;
  private _activeEncounter: Encounter;

  /**
  * This constructor takes the data object if building from scratch or the other object if copying.
  * The accessor methods must be used for each field that needs to be synced. As such, when modifying
  * an array you must make a copy of it and assign it after updating.
  */
  constructor(data?: CampaignData, other?: Campaign) {
    super(other);

    if (data) {
      console.log("Building campaign: " + JSON.stringify(data));
      //The first three fields are all required and can't be null
      this.saveField("_name", data.name);
      this.saveField("_game", data.game);
      this.saveField("_description", data.description);
      this.saveField("_gm", data.gm);
      this.saveField("_activeEncounter", data.activeEncounter);

      if (data.hasOwnProperty('characters') && data.characters != null) {
        this.saveField("_characters", data.characters);
      } else {
        this.saveField("_characters", new Array<Character>());
      }

      if (data.hasOwnProperty('locations') && data.locations != null) {
        this.saveField("_locations", data.locations);
      } else {
        this.saveField("_locations", new Array<Location>());
      }

      if (data.hasOwnProperty('players') && data.players != null) {
        this.saveField("_players", data.players);
      } else {
        this.saveField("_players", new Array<Player>());
      }

      if (data.hasOwnProperty('encounterHistory') && data.encounterHistory != null) {
        this.saveField("_encounterHistory", data.encounterHistory);
      } else {
        this.saveField("_encounterHistory", new Array<Encounter>());
      }

      if (data.hasOwnProperty('currentEncounters') && data.currentEncounters != null) {
        this.saveField("_currentEncounters", data.currentEncounters);
      } else {
        this.saveField("_currentEncounters", new Array<Encounter>());
      }

      if (data.hasOwnProperty('timestamps') && data.timestamps != null) {
        this.setTimestamps(data.timestamps);
      }
    }
  }

  //Setters wrap the saveField method for updating timestamps automatically
  get name(): string { return this._name; }
  set name(name: string) { this.saveField("_name", name); }
  get game(): Game { return this._game; }
  set game(game: Game) { this.saveField("_game", game); }
  get description(): string { return this._description; }
  set description(desc: string) { this.saveField("_description", desc); }
  get gm(): Player { return this._gm; }
  set gm(gm: Player) { this.saveField("_gm", gm); }
  get characters(): Array<Character> { return this._characters; }
  set characters(chars: Array<Character>) { this.saveField("_characters", chars); }
  get locations(): Array<Location> { return this._locations; }
  set locations(locs: Array<Location>) { this.saveField("_locations", locs); }
  get players(): Array<Player> { return this._players; }
  set players(players: Array<Player>) { this.saveField("_players", players); }
  get encounterHistory(): Array<Encounter> { return this._encounterHistory; }
  set encounterHistory(encs: Array<Encounter>) { this.saveField("_encounterHistory", encs); }
  get currentEncounters(): Array<Encounter> { return this._currentEncounters; }
  set currentEncounters(encs: Array<Encounter>) { this.saveField("_currentEncounters", encs); }
  get activeEncounter(): Encounter { return this._activeEncounter; }
  set activeEncounter(enc: Encounter) { this.saveField("_activeEncounter", enc); }
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
  constructor(public n: string, public g: string, public d: string, public hn: string, public hi: string) {}
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

  static cloneCampaign(campaign: Campaign): Campaign {
    if (!campaign) {
      return null;
    }

    return new Campaign(null, campaign);
  }

  /**
  * Parses a Campaign object from the given JSON string
  * @param json
  * @return parsed Campaign object
  */
  static fromJSON(json: string): Campaign {
    let otherCampaign = new Campaign(null, SyncObject.parse(json));
    return new Campaign(null, otherCampaign);
  }

  static toJSON(c: Campaign): string {
    let asString = SyncObject.stringify(c);
    return asString;
  }

  /**
  * Converts a Campaign objects to a JSON string broadcast
  * @param campaign
  * @return CampaignBroadcast JSON string
  */
  static toBroadcast(campaign: Campaign): string {
    return JSON.stringify(new CampaignBroadcast(campaign.name, campaign.game.name, campaign.description, campaign.gm.name, campaign.gm.id));
  }

  /**
  * Parses a CampaignBroadcast string to a Campaign object
  * @param broadcast
  * @return parsed Campaign
  */
  static fromBroadcast(broadcast: string): Campaign {
    let b = <CampaignBroadcast>JSON.parse(broadcast);
    return new Campaign({name: b.n, game: GameFactory.buildGame(b.g), description: b.d, gm: PlayerFactory.createPlayer(b.hn, b.hi, null)});
  }
}
