import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { Campaign } from '../../../../shared/objects/campaign';

@Component({
  templateUrl: './campaign-load.html'
})
export class CampaignLoad implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaigns: Campaign[];

  constructor(private storageService: StorageService) {
    this.getCampaigns();
  }

  getTitle() {
    return "Select a Campaign To Load";
  }
  
  async getCampaigns() {
    let map = await this.storageService.getCampaigns();
    this.campaigns = Array.from(map.values());
  }

  deleteCampaign(name: string) {
    let idx = this.campaigns.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.campaigns.splice(idx, 1);
      this.storageService.removeCampaign(name);
    }
  }

  loadCampaign(campaign: Campaign) {
    this.callback('pageChange', 'dashboard');
  }
}

