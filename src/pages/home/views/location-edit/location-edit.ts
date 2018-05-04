import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { LocationService } from '@shared/services';
import { Location } from '@shared/objects';

/**
* This class represents the view for editing/viewing/deleting locations.
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './location-edit.html'
})
export class LocationEdit implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public locations: Location[];

  constructor(private locationService: LocationService) {
    this.locations = Array.from(this.locationService.getLocations().values());
  }

  deleteLocation(name: string) {
    let idx = this.locations.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.locations.splice(idx, 1);
      this.locationService.removeLocation(name);
    }
  }
}
