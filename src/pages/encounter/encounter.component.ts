import { Component } from '@angular/core';
import { Campaign } from '@shared/objects';
import { CampaignStorage } from '@shared/persistence';

@Component({
  templateUrl: 'encounter.html'
})
export class EncounterPage {
  public currentCampaign: Campaign;

  constructor(public campaignStorage: CampaignStorage) {
    this.currentCampaign = this.campaignStorage.getCurrentCampaign();
  }
}
