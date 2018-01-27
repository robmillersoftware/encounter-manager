import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { Location } from '../../../../shared/objects/location';

@Component({
  templateUrl: './location-new.html'
})
export class LocationNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public location: FormGroup;
  public submitAttempted: boolean;

  constructor(private storage: StorageService, private user: UserService, private formBuilder: FormBuilder) {
    this.location = this.formBuilder.group({
      locName: ['', Validators.compose[Validators.required, this.user.hasLocation().bind(this.user)]],
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

      let loc = new Location(obj.location.value.locName, obj.location.value.locDesc);

      obj.storage.addLocation(loc).then(() => {
        obj.callback('pageChange', 'location-edit');
      });
    }
  }
}

