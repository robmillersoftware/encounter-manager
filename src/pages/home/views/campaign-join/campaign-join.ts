import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { ConnectionService, CampaignService, UserService } from '@shared/services';
import { Campaign, CampaignFactory, MessageFactory, Player, PlayerFactory } from '@shared/objects';

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
    this.connectionService.localCampaigns.subscribe((campaigns: Map<string, Campaign>) => {
      if (campaigns) {
        campaigns.forEach((value, key) => {
          this.campaigns.add(value);
        });
      }
    });

    this.connectionService.discoverCampaigns();
  }

  getTitle() {
    return "Join a Campaign";
  }

  async loadCampaign(campaign: Campaign) {
    let identifier = await this.userService.getIdentifier();
    this.connectionService.connectToCampaign(campaign.name);
    this.connectionService.stopDiscovery();
  }
}
