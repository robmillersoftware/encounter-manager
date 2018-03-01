import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { LocationService } from '@shared/services';
import { Location } from '@shared/objects';

@Component({
  templateUrl: './location-list.html'
})
export class LocationList implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public locations: Location[];

  constructor(private locationService: LocationService) {
    this.getLocations();
  }

  getTitle() {
    return "Edit Locations";
  }

  async getLocations() {
    let map = await this.locationService.getLocations();
    this.locations = Array.from(map.values());
  }

  deleteLocation(name: string) {
    let idx = this.locations.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.locations.splice(idx, 1);
      this.locationService.removeLocation(name);
    }
  }
}

