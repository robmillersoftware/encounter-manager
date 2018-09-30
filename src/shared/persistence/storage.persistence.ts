import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Location, Character, Campaign } from '@shared/objects';

/**
 * This class is a wrapper around the Ionic Storage service. This class will contain
 * all of the code for converting to and from local storage. This allows for custom
 * storage and retrieval without peppering the project with ugly conversions.This will
 * eventually be broken out into database mappers.
 *
 * @author Rob Miller
 * @copyright 2018
 */
@Injectable()
export class StorageService {
  constructor(public storage: Storage) {}

  /**
  * Retrieves an object with a matching key from local Storage
  * @param key
  * @return the object in storage
  */
  public async get(key: string) {
    switch(key) {
      case 'conversations':
        return this.storage.get('conversations');
      case 'games':
        return this.storage.get('games');
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
      //Returns a map with key of character name and value of character object
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
      //Gets the current campaign from the user object
      case 'currentCampaign':
        return this.storage.get('currentCampaign');
      //Returns a map with key of campaign name and value of campaign object
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
      //Returns the user object
      case 'user':
        return this.storage.get('user');
    }
  }

  /**
  * Sets the given key to the given value in local Storage
  * @param key Always a string
  * @param value can be any type of object
  */
  public async set(key: string, value: any) {
    switch(key) {
      case 'games':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'conversations':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'locations':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'characters':
        this.storage.set(key, Array.from(value.values()));
        break;
      case 'campaigns':
        this.storage.set(key, Array.from(value.values()));
        break;
      //Sets the current campaign on the user object
      case 'currentCampaign':
        this.storage.set(key, value);
        break;
      case 'user':
        this.storage.set(key, value);
    }
  }
}
