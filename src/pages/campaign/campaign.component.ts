import { Component } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { Campaign } from '../../shared/objects/index';

@Component({
    selector: 'page-campaign',
    templateUrl: 'campaign.html'
})
export class CampaignPage {
    campaign: Campaign;

    constructor(private storage: StorageService) {
        this.storage.getCurrentCampaign().then(campaign => {
            this.campaign = campaign;
        });
    }
}