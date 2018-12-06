import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserService, CampaignService } from '@shared/services';

@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettingsModal {
  public userName: string;
  constructor(public viewCtrl: ViewController, public userService: UserService, public campaignService: CampaignService) {
    this.userName = this.userService.getUserName();
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  public onBlur(event: any) {
    this.userService.setUserName(this.userName);

    console.log("Updating player name in campaign.");
    this.campaignService.updateUserInfo({name: this.userName});
  }
}
