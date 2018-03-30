/**
* This file contains classes related to the Character object. It uses a factory
* pattern to avoid the need to pass around the CharacterData interface and to
* make object construction more intuitive.
*/

interface CharacterData {
  name: string,
  description: string
}

export class Character {
  public name: string;
  public description: string;

  constructor(char: CharacterData) {
    this.name = char.name;
    this.description = char.description;
  }
}

export class CharacterFactory {
  static createCharacter(name: string, description: string): Character {
    return new Character({name: name, description: description});
  }

  static fromJSON(json: string): Character {
    return new Character(<CharacterData>JSON.parse(json));
  }
}
