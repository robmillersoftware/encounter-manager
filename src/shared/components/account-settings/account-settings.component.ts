import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserStorage } from '@shared/persistence';
import { User } from '@shared/objects';

@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettingsModal {
  public user: User;
  constructor(public viewCtrl: ViewController, public userStorage: UserStorage) {
    this.user = this.userStorage.getUser();
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  public onBlur(event: any) {
    this.userStorage.setName(this.user.name);
  }
}
