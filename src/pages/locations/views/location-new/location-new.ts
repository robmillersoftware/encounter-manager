import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationViewComponent } from '../location-view.component';
import { StorageService } from '../../../../shared/services/storage.service';

@Component({
  templateUrl: './location-new.html'
})
export class LocationNew implements LocationViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public location: FormGroup;
  public submitAttempted: boolean;

  constructor(private service: StorageService, private formBuilder: FormBuilder) {
    this.location = this.formBuilder.group({
      locName: ['', Validators.compose[Validators.required, this.service.hasLocation().bind(this.service)]],
      locDesc: ['']
    });
  }

  createLocation() {
    let obj = this;

    if (obj.location.get('locName').hasError('has_location')) {
      obj.submitAttempted = true;
    } else {
      obj.submitAttempted = false;
      obj.service.addLocation(obj.location.value).then(() => {
        obj.callback('edit');
      });
    }
  }
}

