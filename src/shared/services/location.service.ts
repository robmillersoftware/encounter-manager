import { Injectable } from '@angular/core';
import { StorageService } from '@shared/services';
import { Location } from '@shared/objects';

/**
* This service manages any locations created by the user or received from other
* users
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class LocationService {
    constructor(public storage: StorageService) {}

    /**
    * Retrieves a map of locations from storage
    */
    private async queryLocations() {
        return this.storage.get('locations').then(val => val);
    }

    /**
    * Forwards the return value from queryLocations
    * @return map<string, Location>
    */
    async getLocations() {
        return await this.queryLocations();
    }

    /**
    * Creates an new location. Does nothing if location already exists
    * @param loc
    */
    async addLocation(loc: Location) {
        let locations = await this.queryLocations();

        if (!locations.has(loc.name)) {
            locations.set(loc.name, loc);
        }

        this.storage.set('locations', locations);
    }

    /**
    * Removes an existing location or does nothing if the location does not exist
    * @param locName
    */
    async removeLocation(locName: string) {
        let locations = await this.queryLocations();

        if (locations.has(locName)) {
            locations.delete(locName);
        }

        this.storage.set('locations', locations);
    }
}
