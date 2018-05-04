import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserService } from '@shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettingsModal {
  constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
      public userService: UserService) {
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }
}
