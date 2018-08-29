import { Component, Input, NgZone } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { UserStorage } from '@shared/persistence';
import { CampaignService } from '@shared/services';
import { NetworkingService } from '@networking';
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

  constructor(public network: NetworkingService, public campaignService: CampaignService,
      public userStorage: UserStorage, public zone: NgZone) {
    this.campaigns = new Set<Campaign>();
    this.network.subscribeToNetworks(remotes => {
      this.campaigns = remotes;
    });
    this.network.search();
  }

  /**
  * Button callback that loads the remote campaign, saves it to local storage, and
  * then stops service discovery
  */
  public async loadCampaign(campaign: Campaign) {
    console.log("Joining campaign: " + campaign.name);
    let success = await this.network.joinNetwork(campaign.gm.endpoint);

    if (success) {
      this.network.stopSearch();
      this.campaignService.setCurrentCampaign(campaign);
      this.callback('tabChange');
    }
  }
}
