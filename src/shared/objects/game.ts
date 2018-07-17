/**
* This object represents the game that is being played by a campaign.
*/
interface GameData {
  name: string
}

export class Game {
  public name: string;

  constructor(data: GameData) {
      this.name = data.name;
  }
}

export class GameFactory {
  static buildGame(name: string): Game {
    return new Game({name: name});
  }

  static toJson(game: Game): string {
    return JSON.stringify(game);
  }

  static fromJson(json: string): Game {
    let game: Game = JSON.parse(json);
    return new Game({name: game.name});
  }
}
