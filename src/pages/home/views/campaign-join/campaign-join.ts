import { Component, Input, NgZone } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { ConnectionService, CampaignService, UserService } from '@shared/services';
import { Campaign } from '@shared/objects';

/**
* This class represents the view for joining a remote campaign
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public campaigns: Set<Campaign>;

  constructor(public connectionService: ConnectionService, public campaignService: CampaignService,
      public userService: UserService, public zone: NgZone) {
    this.campaigns = new Set<Campaign>();
    this.startDiscovery();
  }

  /**
  * Starts discovery of Nearby services
  */
  private async startDiscovery() {
    //First we subscribe to changes in the list of remote campaigns in the connection service
    this.connectionService.remoteCampaigns.subscribe((campaigns: Map<string, Campaign>) => {
      if (campaigns) {
        this.zone.run(() => {
          campaigns.forEach((value, key) => {
            this.campaigns.add(value);
          });
        });
      }
    });

    //Then start discovery
    this.connectionService.discoverCampaigns();
  }

  /**
  * Button callback that loads the remote campaign, saves it to local storage, and
  * then stops service discovery
  */
  public async loadCampaign(campaign: Campaign) {
    this.connectionService.connectToCampaign(campaign.name, success => {
      if (success) {
        this.connectionService.stopDiscovery();
        this.campaignService.joinCampaign(campaign);
        this.callback('tabChange');
      }
    });
  }
}
