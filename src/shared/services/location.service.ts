import { Injectable } from '@angular/core';
import { StorageService } from '@shared/services';
import { Location } from '@shared/objects';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
* This service manages any locations created by the user or received from other
* users
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class LocationService {
  public locationSubject: BehaviorSubject<Map<string, Location>>;

  constructor(public storage: StorageService) {
    this.locationSubject = new BehaviorSubject<Map<string, Location>>(new Map());
    this.loadLocations();
  }

  /**
  * Loads the initial list of locations into the behavior subject
  */
  private async loadLocations() {
      let locations: Map<string, Location> = await this.storage.get('locations').then(val => val);

      if (locations) {
        this.setLocations(locations);
      }
  }

  /**
  * Sets the locations on the behavior subject and local storage
  */
  private setLocations(loc: Map<string, Location>) {
    this.locationSubject.next(loc);
    this.storage.set('locations', loc);
  }

  /**
  * Returns the current value of the locations behaviorsubject
  * @return map<string, Location>
  */
  public getLocations() {
      return this.locationSubject.value;
  }

  /**
  * Creates an new location. Does nothing if location already exists
  * @param loc
  */
  public addLocation(loc: Location) {
      let locations = this.locationSubject.value;

      if (!locations.has(loc.name)) {
          locations.set(loc.name, loc);
      }

      this.setLocations(locations);
  }

  /**
  * Removes an existing location or does nothing if the location does not exist
  * @param locName
  */
  public removeLocation(locName: string) {
      let locations = this.locationSubject.value;

      if (locations.has(locName)) {
          locations.delete(locName);
      }

      this.setLocations(locations);
  }
}
