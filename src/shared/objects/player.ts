/**
* This file contains all classes and methods relating to Player objects
* @author Rob Miller
* @copyright 2018
*/
import { Character } from '@shared/objects';

/**
* This interface is used to construct Player objects
*/
interface PlayerData {
  name: string,
  endpoint: string,
  characters?: Array<Character>
}

/**
* This class represents a player in a campaign
*/
export class Player {
  public name: string;
  public endpoint: string;
  public characters: Array<Character>;

  constructor(data: PlayerData) {
    this.name = data.name;
    this.endpoint = data.endpoint;
    this.characters = data.hasOwnProperty('characters') ? data.characters : new Array<Character>();
  }
}

/**
* This class is responsible for the creation and manipulation of Player objects
*/
export class PlayerFactory {
  /**
  * Creates a Player object with the given parameters
  * @param identifier
  * @param isGm
  * @param characters
  * @return the created Player
  */
  static createPlayer(name: string, endpoint: string, characters?: Array<Character>): Player {
    return new Player({name: name, endpoint: endpoint, characters: characters});
  }

  /**
  * Parses a player object from a JSON string
  * @param json
  * @return parsed Player
  */
  static fromJSON(json: string): Player {
    return new Player(<PlayerData>JSON.parse(json));
  }
}
