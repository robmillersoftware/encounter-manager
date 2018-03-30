import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { ConnectionService, CampaignService, UserService } from '@shared/services';
import { Campaign, CampaignFactory, MessageFactory } from '@shared/objects';

@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  public campaigns: Set<Campaign>;

  constructor(public connectionService: ConnectionService, public campaignService: CampaignService,
      public userService: UserService) {
    this.campaigns = new Set<Campaign>();
    this.startDiscovery();
  }

  async startDiscovery() {
    let name: string = await this.userService.getName();
    this.connectionService.discoverCampaigns(name, campaignMessage => {
      console.log("GOT MESSAGE: " + JSON.stringify(campaignMessage));
      //let message = MessageFactory.fromJSON(campaignMessage);
      //this.campaigns.add(CampaignFactory.fromBroadcast(message.data));
    });
  }

  getTitle() {
    return "Join a Campaign";
  }

  loadCampaign(campaign: Campaign) {

  }
}
