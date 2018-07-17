import { Injectable } from '@angular/core';
import { Game } from '@shared/objects';
import { GameStorage } from '@shared/persistence';

/**
* This service handles messages between peer devices
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class GameService {
  constructor(public gameStorage: GameStorage) {
  }

  public getGame(name: string): Game {
    return this.gameStorage.getGame(name);
  }
}
