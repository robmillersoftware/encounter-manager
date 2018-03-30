/**
* This service manages the state of the user of this application.
* @author Rob Miller
* @author robmillersoftware@gmail.com
*/

import { Injectable } from '@angular/core';
import { User, UserFactory } from '@shared/objects';
import { StorageService } from '@shared/services';

import * as uuidv4 from 'uuid/v4';

@Injectable()
export class UserService {
  constructor(public storageService: StorageService) {
    this.loadUser();
  }

  private async loadUser() {
    let user: User = await this.storageService.get('user');

    if (!user) {
      user = UserFactory.createUser("Anonymous", uuidv4());
    }

    this.storageService.set('user', user);
  }

  async getUser() {
    return await this.storageService.get('user');
  }
  
  async setName(name: string) {
    let user: User = await this.storageService.get('user');
    user.name = name;
    this.storageService.set('user', user);
  }

  async getName() {
    let user: User = await this.storageService.get('user');
    return user.name;
  }

  async getId() {
    let user: User = await this.storageService.get('user');
    return user.id;
  }
}
