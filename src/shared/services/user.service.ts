import { Injectable } from '@angular/core';
import { UserStorage } from '@shared/persistence';

/**
* This service handles messages between peer devices
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class UserService {
  constructor(public userStorage: UserStorage) {
  }

  public getUserName(): string {
    return this.userStorage.getUser().name;
  }

  public setUserName(name: string) {
    this.userStorage.setName(name);
  }

  public getId(): string {
    return this.userStorage.getUser().uuid;
  }
}
