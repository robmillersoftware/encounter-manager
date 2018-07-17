/**
* This service manages the game storage for the application
* @author Rob Miller
* @copyright 2018
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StorageService } from '@shared/persistence';
import { Game, GameFactory } from '@shared/objects';

@Injectable()
export class GameStorage {
  //Maintains a list of campaigns from local storage
  public games: BehaviorSubject<Array<Game>>;

  constructor(public storage: StorageService) {
    this.games = new BehaviorSubject<Array<Game>>(null);
    this.initGames();
  }

  private async initGames() {
    let games: Array<Game> = await this.storage.get('games');

    if (!games) {
      games = new Array<Game>();

      //Initialize the supported games
      games.push(GameFactory.buildGame('Autology'));
      games.push(GameFactory.buildGame('None'));
    }

    this.games.next(games);
  }

  public getGames(): Array<Game> {
    return this.games.value;
  }

  public createGame(game: Game) {
    let games = this.games.value;
    games.push(game);
    this.games.next(games);
    this.storage.set('games', games);
  }

  public getGame(name: string): Game {
    let idx = this.games.value.findIndex(game => {
      return game.name === name;
    });

    if (idx > -1) {
      return this.games.value[idx];
    }

    return null;
  }

  public updateGame(game: Game) {
    let games = this.games.value;
    let idx = games.findIndex(game => {
      return game.name === game.name;
    });

    if (idx > -1) {
      games[idx] = game;
      this.games.next(games);
      this.storage.set('games', games);
    }
  }
}
