import { Component, Input } from '@angular/core';
import { LocationViewComponent } from '../location-view.component';
import { StorageService } from '../../../../shared/services/storage.service';

@Component({
  templateUrl: './location-list.html'
})
export class LocationList implements LocationViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  
  public locations: any[];

  constructor(private storageService: StorageService) {
    this.getLocations();
  }

  async getLocations() {
    this.locations = await this.storageService.getLocationsArray();
  }
}

