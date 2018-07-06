/**
* This file contains classes related to the Character object. It uses a factory
* pattern to avoid the need to pass around the CharacterData interface and to
* make object construction more intuitive.
* @author Rob Miller
* @copyright 2018
*/
import { Player } from '@shared/objects';

/**
* This interface is used to construct Character objects
*/
interface CharacterData {
  name: string,
  description: string,
  player?: Player,
  campaignId?: number
}

/**
* This class represents a character in a campaign. This can be a PC or NPC
*/
export class Character {
  public name: string;
  public description: string;
  public player: Player;
  public campaignId: number;

  constructor(char: CharacterData) {
    this.name = char.name;
    this.description = char.description;
    this.player = char.hasOwnProperty("player") ? char.player : null;
    this.campaignId = char.hasOwnProperty("campaignId") ? char.campaignId: -1;
  }
}

/**
* This class is responsible for the creation and manipulation of characters
*/
export class CharacterFactory {
  /**
  * Create a Character object from the given parameters
  * @param name
  * @param description
  * @return the created Character
  */
  static createCharacter(name: string, description: string, player?: Player, id?: number): Character {
    return new Character({name: name, description: description, player: player, campaignId: id});
  }

  /**
  * Parse a Character object from a JSON string
  * @param json
  * @return the parsed Character
  */
  static fromJSON(json: string): Character {
    return new Character(<CharacterData>JSON.parse(json));
  }
}
