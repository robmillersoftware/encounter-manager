import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { HomeViews } from '@pages/home/home.service';
import { LocationService } from '@shared/persistence';
import { LocationFactory } from '@shared/objects';

/**
* This class represents the view for creating a new location
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './location-new.html'
})
export class LocationNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public locationInfo: FormGroup;

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {
    this.locationInfo = this.formBuilder.group({
      locName: ['', Validators.required],
      locDesc: ['']
    });
  }

  /**
  * Submit callback that creates a new location and adds it to local storage. It then
  * Navigates to the edit page
  */
  public createLocation() {
    let loc = LocationFactory.createLocation(this.locationInfo.value.locName, this.locationInfo.value.locDesc);

    this.locationService.addLocation(loc);
    this.callback('viewChange', HomeViews.LOCATION_EDIT);
  }
}
