import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { CampaignService } from '@shared/services';
import { Campaign } from '@shared/objects';

/**
* This class represents the view for loading and deleting campaigns
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './campaign-load.html'
})
export class CampaignLoad implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public campaigns: Array<Campaign>;

  constructor(private campaignService: CampaignService) {
    this.getCampaigns();
  }

  /**
  * Queries local storage for a list of campaigns
  */
  private async getCampaigns() {
    let map: Map<string, Campaign> = await this.campaignService.getCampaigns();
    this.campaigns = Array.from(map.values());
  }

  /**
  * Button callback for deleting campaigns
  */
  private deleteCampaign(name: string) {
    this.campaigns.forEach((campaign, i) => {
      if (campaign.name === name) {
        this.campaigns.splice(i, 1);
      }
    });

    this.campaignService.removeCampaign(name);

    //If there are no campaigns left, then go back to the dashboard
    if (this.campaigns.length === 0) {
      this.callback('viewChange', 'dashboard')
    }
  }

  /**
  * Button callback for loading a campaign
  * @param campaign
  */
  private async loadCampaign(campaign: Campaign) {
    this.campaignService.setCurrentCampaign(campaign).then(() => {
      this.callback('tabChange', 'campaign')
    });
  }
}
