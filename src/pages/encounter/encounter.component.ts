import { Component } from '@angular/core';
import { Campaign } from '@shared/objects';
import { CampaignService } from '@shared/services';

@Component({
    templateUrl: 'encounter.html'
})
export class EncounterPage {
    public currentCampaign: Campaign;

    constructor(public campaignService: CampaignService) {
        this.getCampaign();
    }

    private async getCampaign() {
        this.campaignService.getCurrentCampaign().then(campaign => {
            this.currentCampaign = campaign;
        });
    }
}