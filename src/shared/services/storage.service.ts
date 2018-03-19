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
import { Location, Character, Campaign } from '@shared/objects';

@Injectable()
export class StorageService {
    constructor(public storage: Storage) {}

    public async get(key: string) {
        switch(key) {
            case 'id':
                return this.storage.get('id');
            case 'name':
                return this.storage.get('name');
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
                return this.storage.get('currentCampaign').then(c => c ? c : null);
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
        }
    }

    public async set(key: string, value: any) {
        switch(key) {
            case 'id':
                this.storage.set(key, value);
                break;
            case 'name':
                this.storage.set(key, value);
                break;
            case 'locations':
                this.storage.set(key, Array.from(value.values()));
                break;
            case 'characters':
                this.storage.set(key, Array.from(value.values()));
                break;
            case 'currentCampaign':
                this.storage.set(key, value);
                break;
            case 'campaigns':
                this.storage.set(key, Array.from(value.values()));
                break;
        }
    }
}
