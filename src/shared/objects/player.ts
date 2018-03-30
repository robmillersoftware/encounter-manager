import { Character } from '@shared/objects';

interface PlayerData {
  name: string,
  id: string,
  isGm: boolean,
  characters?: Array<Character>
}

export class Player {
  public name: string;
  public id: string;
  public characters: Array<Character>;
  public isGm: boolean;

  constructor(data: PlayerData) {
    this.name = data.name;
    this.id = data.id;
    this.isGm = data.isGm;
    this.characters = data.hasOwnProperty('characters') ? data.characters : new Array<Character>();
  }
}

class PlayerBroadcast {
  constructor(public n: string, public i: string, public g: boolean) {}
}

export class PlayerFactory {
  static createPlayer(name: string, id: string, isGm: boolean, characters: Array<Character>): Player {
    return new Player({name: name, id: id, isGm: isGm, characters: characters});
  }

  static fromJSON(json: string): Player {
    return new Player(<PlayerData>JSON.parse(json));
  }

  static toBroadcast(player: Player): string {
    return JSON.stringify(new PlayerBroadcast(player.name, player.id, player.isGm));
  }

  static fromBroadcast(p: string): Player {
    let pBroadcast = <PlayerBroadcast>JSON.parse(p);
    return new Player({name: pBroadcast.n, id: pBroadcast.i, isGm: pBroadcast.g});
  }
}
