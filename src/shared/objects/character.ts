/**
* This file contains classes related to the Character object. It uses a factory
* pattern to avoid the need to pass around the CharacterData interface and to
* make object construction more intuitive.
* @author Rob Miller
* @copyright 2018
*/

/**
* This interface is used to construct Character objects
*/
interface CharacterData {
  name: string,
  description: string
}

/**
* This class represents a character in a campaign. This can be a PC or NPC
*/
export class Character {
  public name: string;
  public description: string;

  constructor(char: CharacterData) {
    this.name = char.name;
    this.description = char.description;
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
  static createCharacter(name: string, description: string): Character {
    return new Character({name: name, description: description});
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
