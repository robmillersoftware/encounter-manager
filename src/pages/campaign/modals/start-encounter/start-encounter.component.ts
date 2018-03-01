import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '@shared/services';
import { Campaign, Encounter, Location } from '@shared/objects';

@Component({
  selector: 'page-start-encounter',
  templateUrl: 'start-encounter.html'
})
export class StartEncounterModal {
  public encounterInfo: FormGroup;
  public campaign: Campaign;

  constructor(public viewCtrl: ViewController, public campaignService: CampaignService,
      private formBuilder: FormBuilder) {
    this.encounterInfo = this.formBuilder.group({
      encounterLoc: ['', Validators.required],
      encounterParticipants: ['']
    });

    this.getCampaign();
  }

  private async getCampaign() {
    this.campaignService.getCurrentCampaign().then(c => this.campaign = c);
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  public async startEncounter() {
    let encounter = new Encounter();
    let selectedLocation: Location =
        this.campaign.locations.find(loc => this.encounterInfo.value.encounterLoc === loc.name);

    encounter.location = selectedLocation;

    if (this.encounterInfo.value.encounterParticipants) {
      this.encounterInfo.value.encounterParticipants.forEach(char => {
        let stripped = char.replace(/\s+$/, '');
        let idx = this.campaign.characters.findIndex(c => c.name.trim() === stripped.trim());

        if (idx >= 0) {
          encounter.participants.push(this.campaign.characters[idx]);
        }
      });
    }

    this.campaignService.startEncounter(encounter);
    this.closeModal(true);
  }
}