import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Location } from '../objects';

@Injectable()
export class LocationService {
    constructor(public storage: StorageService) {}

    private async queryLocations() {
        return this.storage.get('locations').then(val => val);
    }

    async getLocations() {
        return await this.queryLocations();
    }
    
    async updateLocation(loc: Location) {
        let locations = await this.queryLocations();
        locations.set(loc.name, loc);
        this.storage.set('locations', locations);
    }

    async addLocation(loc: Location) {
        let locations = await this.queryLocations();

        if (!locations.has(loc.name)) {
            locations.set(loc.name, loc);
        }

        this.storage.set('locations', locations);
    }

    async removeLocation(locName: string) {
        let locations = await this.queryLocations();

        if (locations.has(locName)) {
            locations.delete(locName);
        }

        this.storage.set('locations', locations);
    }
}