import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserService, CampaignService } from '@shared/services';

@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html'
})
export class AppSettingsModal {
  constructor(public viewCtrl: ViewController, public userService: UserService, public campaignService: CampaignService) {
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  public clearData() {
    this.userService.clearStorage();
  }
}
