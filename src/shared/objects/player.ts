/**
* This file contains all classes and methods relating to Player objects
* @author Rob Miller
* @copyright 2018
*/
import { Character, CharacterFactory } from '@shared/objects';

/**
* This interface is used to construct Player objects
*/
interface PlayerData {
  identifier: string,
  isGm: boolean,
  characters?: Array<Character>
}

/**
* This class represents a player in a campaign
*/
export class Player {
  public identifier: string;
  public characters: Array<Character>;
  public isGm: boolean;

  constructor(data: PlayerData) {
    this.identifier = data.identifier;
    this.isGm = data.isGm;
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
  static createPlayer(identifier: string, isGm: boolean, characters: Array<Character>): Player {
    return new Player({identifier: identifier, isGm: isGm, characters: characters});
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
