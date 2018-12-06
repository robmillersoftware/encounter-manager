import { Component, Input, NgZone } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { CampaignService, UserService } from '@shared/services';
import { Campaign, CampaignFactory, PlayerFactory } from '@shared/objects';

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

  constructor(public campaignService: CampaignService, public userService: UserService, public zone: NgZone) {
    this.campaignService.discoverCampaigns((remotes: Map<string, string>) => {
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
  }

  /**
  * Button callback that loads the remote campaign, saves it to local storage, and
  * then stops service discovery
  */
  public async loadCampaign(campaign: Campaign) {
    console.log("Joining campaign: " + campaign.name + " at endpoint: " + campaign.gm.endpoint);
    this.campaignService.joinCampaign(campaign).then(() => {
      console.log("Campaign joined successfully.");

      //Add yourself to the campaign object
      //TODO: Who is actually in charge of this? How do we sync?
      campaign.players.push(PlayerFactory.createPlayer(this.userService.getUserName(), this.userService.getId(), null, null));

      this.campaignService.setCurrentCampaign(campaign);
      this.callback('tabChange');
    });
  }
}
