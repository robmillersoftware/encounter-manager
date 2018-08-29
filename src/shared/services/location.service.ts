import { Injectable } from '@angular/core';
import { Location } from '@shared/objects';
import { LocationStorage } from '@shared/persistence';

/**
* This service manages locations
*
* @author Rob Miller
* @copyright 2018
*/
//TODO: Does this need work?
@Injectable()
export class LocationService {
  constructor(private locationStorage: LocationStorage) {}

  /**
  * Subscribe to changes in the Location list
  * @param callback this method is executed when the locations change
  */
  public subscribe(callback: any) {
    this.locationStorage.locations.subscribe(callback);
  }

  /**
  * Add location to list
  * @param loc the Location to add
  */
  public addLocation(loc: Location) {
    this.locationStorage.addLocation(loc);
  }

  /**
  * Returns a map of locations from storage.
  * @return a map of locations with key = location name
  */
  public getLocations(): Map<string, Location> {
    return this.locationStorage.locations.value;
  }

  /**
  * Returns a location with the given name
  * @param name
  */
  public getLocation(name: string): Location {
    return this.locationStorage.getLocation(name);
  }

  /**
  * Deletes a location from storage
  * @param cName the name of the location to delete
  */
  public deleteLocation(cName: string) {
    this.locationStorage.deleteLocation(cName);
  }
}
