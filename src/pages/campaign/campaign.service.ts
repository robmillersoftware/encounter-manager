import { Injectable } from '@angular/core';
import { CampaignView } from './views/campaign-view';
import { CampaignNew } from './views/campaign-new/campaign-new';
import { CampaignLoad } from './views/campaign-load/campaign-load';
import { CampaignJoin } from './views/campaign-join/campaign-join';
import { CampaignCurrent } from './views/campaign-current/campaign-current'; 
import { Campaign } from '../../objects/campaign';

@Injectable()
export class CampaignService {
  public currentCampaign: Campaign;
  
  getViews() {
    return [
      new CampaignView(CampaignNew, 'New', {}),
      new CampaignView(CampaignLoad, 'Load', {}),
      new CampaignView(CampaignJoin, 'Join', {}),
      new CampaignView(CampaignCurrent, 'Current', { campaign: this.currentCampaign })
    ];
  }
}
