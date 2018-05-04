import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '@shared/services';
import { Campaign, EncounterFactory, Location } from '@shared/objects';

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

    this.campaignService.currentCampaignSubject.subscribe((c) => {
      this.campaign = c;
    });
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  public async startEncounter() {
    console.log("check1");
    let encounter = EncounterFactory.createEncounter();
        console.log("check2");
    let selectedLocation: Location =
        this.campaign.locations.find(loc => this.encounterInfo.value.encounterLoc === loc.name);

    console.log("check3");
    encounter.location = selectedLocation;
    console.log("check4");
    if (this.encounterInfo.value.encounterParticipants) {
          console.log("check5");
      this.encounterInfo.value.encounterParticipants.forEach(char => {
            console.log("check6");
        let stripped = char.replace(/\s+$/, '');
        let idx = this.campaign.characters.findIndex(c => c.name.trim() === stripped.trim());
        console.log("check7");
        if (idx >= 0) {
          encounter.participants.push(this.campaign.characters[idx]);
          console.log("check8");
        }
      });
    }

    this.campaignService.startEncounter(encounter);
    console.log("check9");
    this.closeModal(true);
  }
}
