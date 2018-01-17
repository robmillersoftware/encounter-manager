import { Injectable } from '@angular/core';
import { LocationView } from './views/location-view';
import { LocationList } from './views/location-list/location-list';
import { LocationNew } from './views/location-new/location-new';

@Injectable()
export class LocationService {
  getViews() {
    return [
      new LocationView(LocationList, 'Edit', {}),
      new LocationView(LocationNew, 'New', {})
    ];
  }
}
