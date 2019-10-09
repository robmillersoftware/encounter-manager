import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { User, UserFactory } from '@shared/objects';
import { StorageService } from '@shared/persistence';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
* This service manages the state of the user of this application.
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class UserStorage {
  public userSubject: BehaviorSubject<User>;

  constructor(public platform: Platform, public storageService: StorageService) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.platform.ready().then(() => {
      console.log("Platorm ready. User proile is loaded");
      this.loadUser();
    });
  }

  /**
  * Loads a user from local storage or creates a new one if no user exists
  */
  private async loadUser() {
    let user = await this.storageService.get('user');
    if (!user) {
      //If there is no user in storage, then create a new one
      user = UserFactory.createUser("Anonymous");
    }

    this.setUser(user);
  }

  /**
  * Updates the observable and local storage
  */
  private setUser(user: User) {
    this.userSubject.next(user);
    this.storageService.set('user', user);
  }

  /**
  * Returns the user object from local storage
  */
  public getUser(): User {
    return this.userSubject.value;
  }

  /**
  * Sets the name on the local user
  * @param name
  */
  public setName(name: string) {
    console.log("setting name to " + name);
    let user: User = this.userSubject.value;
    user.name = name;
    this.setUser(user);
  }

  /**
   * Clears all application storage
   */
  public clearStorage() {
    this.storageService.clearAll();
  }
}
