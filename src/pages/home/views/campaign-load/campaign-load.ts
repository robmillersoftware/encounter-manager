import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { CampaignService } from '../../../../shared/services';
import { Campaign } from '../../../../shared/objects/campaign';

@Component({
  templateUrl: './campaign-load.html'
})
export class CampaignLoad implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaigns: Array<Campaign>;

  constructor(private campaignService: CampaignService) {
    this.getCampaigns();
  }

  getTitle() {
    return "Select a Campaign To Load";
  }
  
  async getCampaigns() {
    let map: Map<string, Campaign> = await this.campaignService.getCampaigns();
    this.campaigns = Array.from(map.values());
  }

  deleteCampaign(name: string) {
    this.campaigns.forEach((campaign, i) => {
      if (campaign.name === name) {
        this.campaigns.splice(i, 1);
      }
    });

    this.campaignService.removeCampaign(name);
    
    if (this.campaigns.length === 0) {
      this.callback('pageChange', 'dashboard')
    }
  }

  loadCampaign(campaign: Campaign) {
    this.campaignService.setCurrentCampaign(campaign).then(() => {
      this.callback('tabChange', 'campaign');
    });
  }
}

