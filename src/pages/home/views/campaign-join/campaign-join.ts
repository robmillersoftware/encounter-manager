import { Component, Input, NgZone } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { UserStorage } from '@shared/persistence';
import { CampaignService } from '@shared/services';
import { NetworkingService } from '@networking';
import { Campaign, CampaignFactory, Player, PlayerFactory } from '@shared/objects';
import { debugMap } from '@globals';

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

  public campaigns: Array<Campaign> = new Array<Campaign>();

  constructor(public network: NetworkingService, public campaignService: CampaignService,
      public userStorage: UserStorage, public zone: NgZone) {

    this.network.subscribeToNetworks((remotes: Map<string, string>) => {
      this.zone.run(() => {
        let campaigns: Array<Campaign> = new Array<Campaign>();

        Array.from(remotes.keys()).forEach(key => {
          let campaign: Campaign = CampaignFactory.fromBroadcast(remotes.get(key));
          campaign.gm.endpoint = key;

          campaigns.push(campaign);
        });

        this.campaigns = campaigns;
      });
    });
    this.network.discover();
  }

  /**
  * Button callback that loads the remote campaign, saves it to local storage, and
  * then stops service discovery
  */
  public async loadCampaign(campaign: Campaign) {
    console.log("Joining campaign: " + campaign.name + " at endpoint: " + campaign.gm.endpoint);
    let success = await this.network.joinNetwork(campaign.gm.endpoint);

    if (success) {
      this.network.stopDiscovery();
      this.campaignService.setCurrentCampaign(campaign);
      this.callback('tabChange');
    }
  }
}
