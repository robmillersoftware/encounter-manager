/**
 * This file is a wrapper around the Ionic Storage service. This class will contain
 * all of the code for converting to and from local storage. This allows for custom
 * storage and retrieval without peppering the project with ugly conversions.This will
 * eventually be broken out into database mappers.
 *
 * @author Rob Miller
 * @author robmillersoftware@gmail.com
 */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Location, Character, Campaign, User } from '@shared/objects';

@Injectable()
export class StorageService {
  constructor(public storage: Storage) {}

  public async get(key: string) {
    switch(key) {
      case 'locations':
        return this.storage.get('locations').then(val => {
          let map: Map<string, Location> = new Map();

            if (Array.isArray(val)) {
              let arr: Array<Location> = val;
              arr.forEach(loc => {
                map.set(loc.name, loc);
              });
            }

            return map;
        });
      case 'characters':
        return this.storage.get('characters').then(val => {
          let map: Map<string, Character> = new Map();

          if (Array.isArray(val)) {
            let arr: Array<Character> = val;
            arr.forEach(char => {
                map.set(char.name, char);
            });
          }

          return map;
        });
      case 'currentCampaign':
        let user: User = await this.storage.get('user');
        return user.currentCampaign;
      case 'campaigns':
        return this.storage.get('campaigns').then(val => {
          let map: Map<string, Campaign> = new Map();

          if (Array.isArray(val)) {
            let arr: Array<Campaign> = val;
            arr.forEach(c => {
              map.set(c.name, c);
            });
          }

          return map;
        });
      case 'user':
        return this.storage.get('user');
    }
  }

  public async set(key: string, value: any) {
    switch(key) {
      case 'locations':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'characters':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'currentCampaign':
        let user: User = await this.storage.get('user');
        user.currentCampaign = value;
        this.storage.set('user', user);
        break;
      case 'campaigns':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'user':
        this.storage.set(key, value);
    }
  }
}
