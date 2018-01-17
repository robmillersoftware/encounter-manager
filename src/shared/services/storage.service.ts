import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';

@Injectable()
export class StorageService {
    private locations: any;

    constructor(public storage: Storage) {
        this.queryLocations();
    }

    private async queryLocations() {
        let obj = this;

        return obj.storage.get('locations').then(val => {
            if (!val) {
                obj.locations = {};
            } else {
                obj.locations = JSON.parse(val);
            }

            return obj.locations;
        });
    }

    async getLocationsArray() {
        let obj = await this.queryLocations();

        let arr = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(obj[key]);
            }
        }
        return arr;
    }
    
    async addLocation(loc: any) {
        await this.queryLocations();

        if (!this.locations[loc.locName]) {
            this.locations[loc.locName] = loc;
        }

        this.storage.set('locations', JSON.stringify(this.locations));
    }

    hasLocation(): ValidatorFn {        
        this.queryLocations();

        let obj = this;
        return (control: AbstractControl): {[key: string]: any} => {
            let input = control.value;
            let isValid = !obj.locations.hasOwnProperty(input);

            if (!isValid) {
                return { 'has_location': { isValid }};
            } else {
                return null;
            }
        }; 
    }
}