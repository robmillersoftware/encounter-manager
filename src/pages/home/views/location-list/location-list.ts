import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { Location } from '../../../../shared/objects/location';

@Component({
  templateUrl: './location-list.html'
})
export class LocationList implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  
  public locations: Location[];

  constructor(private storageService: StorageService) {
    this.getLocations();
  }

  getTitle() {
    return "Edit Locations";
  }

  async getLocations() {
    let map = await this.storageService.getLocations();
    this.locations = Array.from(map.values());
  }

  deleteLocation(name: string) {
    let idx = this.locations.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.locations.splice(idx, 1);
      this.storageService.removeLocation(name);
    }
  }
}

