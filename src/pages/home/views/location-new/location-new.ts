import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { LocationService } from '@shared/services';
import { LocationFactory } from '@shared/objects';

@Component({
  templateUrl: './location-new.html'
})
export class LocationNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public location: FormGroup;
  public submitAttempted: boolean;

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {
    this.location = this.formBuilder.group({
      locName: ['', Validators.required],
      locDesc: ['']
    });
  }

  getTitle() {
    return "Create New Location";
  }

  createLocation() {
    let obj = this;

    if (obj.location.get('locName').hasError('has_location')) {
      obj.submitAttempted = true;
    } else {
      obj.submitAttempted = false;

      let loc = LocationFactory.createLocation(obj.location.value.locName, obj.location.value.locDesc);

      obj.locationService.addLocation(loc).then(() => {
        obj.callback('pageChange', 'location-edit');
      });
    }
  }
}
