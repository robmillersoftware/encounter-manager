import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserService, CampaignService } from '@shared/services';
import { CampaignFactory, GameFactory, PlayerFactory } from '@shared/objects';

const uuidv4 = require('uuid/v4');

@Component({
  selector: 'network-testing',
  templateUrl: 'network-testing.html'
})
export class NetworkTestingPanel {
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

  public advertise() {
    console.log("Advertising a fake campaign.");

    if (!window.localStorage.getItem('campaigns')) {
      window.localStorage.setItem('campaigns', JSON.stringify([]));
    }

    let campaigns = JSON.parse(window.localStorage.getItem('campaigns'));
    campaigns.push(CampaignFactory.createCampaign(
      'test' + campaigns.length,
      GameFactory.buildGame('none'),
      'test campaign',
      PlayerFactory.createPlayer('testPlayer' + campaigns.length, uuidv4(), 'test' + campaigns.length)));

    window.localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }

  public join() {
    console.log("Creating fake player to join user's campaign.");
  }
}
