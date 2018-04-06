import { Character, CharacterFactory } from '@shared/objects';

interface PlayerData {
  identifier: string,
  isGm: boolean,
  characters?: Array<Character>
}

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

class PlayerBroadcast {
  constructor(public i: string, public g: boolean, public c: string) {}
}

export class PlayerFactory {
  static createPlayer(identifier: string, isGm: boolean, characters: Array<Character>): Player {
    return new Player({identifier: identifier, isGm: isGm, characters: characters});
  }

  static fromJSON(json: string): Player {
    return new Player(<PlayerData>JSON.parse(json));
  }

  static toBroadcast(player: Player): string {
    let charStr = "[]";

    if (player.characters) {
      charStr = JSON.stringify(player.characters);
    }

    return JSON.stringify(new PlayerBroadcast(player.identifier, player.isGm, charStr));
  }

  static fromBroadcast(p: string): Player {
    let pBroadcast = <PlayerBroadcast>JSON.parse(p);
    let cBroadcast = JSON.parse(pBroadcast.c);
    let characters = new Array<Character>();
    for (let char in cBroadcast) {
      characters.push(CharacterFactory.fromJSON(char));
    }
    return new Player({identifier: pBroadcast.i, isGm: pBroadcast.g, characters: characters});
  }
}
