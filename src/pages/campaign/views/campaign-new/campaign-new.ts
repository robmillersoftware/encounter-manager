import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignViewComponent } from '../campaign-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { Campaign } from '../../../../objects/campaign';
import { Location } from '../../../../objects/location';
import { Character } from '../../../../objects/character';

@Component({
  templateUrl: './campaign-new.html'
})
export class CampaignNew implements CampaignViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaign: FormGroup;
  public submitAttempted: boolean;

  private allCharacters: Character[];
  private allLocations: Location[];

  constructor(private service: StorageService, private formBuilder: FormBuilder) {
    this.campaign = this.formBuilder.group({
      campaignName: ['', Validators.compose[Validators.required, this.service.hasCampaign().bind(this.service)]],
      campaignDesc: [''],
      campaignChars: [''],
      campaignLocs: ['']
    });

    this.getCharacters();
    this.getLocations();
  }

  async getCharacters() {
    let map = await this.service.getCharacters();
    this.allCharacters = Array.from(map.values());
  }

  async getLocations() {
    let map = await this.service.getLocations();
    this.allLocations = Array.from(map.values());
  }

  createCampaign() {
    let obj = this;

    if (obj.campaign.get('campaignName').hasError('has_campaign')) {
      obj.submitAttempted = true;
    } else {
      obj.submitAttempted = false;

      let selectedChars = new Array<Character>();
      let selectedLocs = new Array<Location>();

      obj.campaign.value.campaignChars.forEach(char => {
        selectedChars.push(obj.allCharacters.find(item => {
          let stripped = char.replace(/\s+$/, "");
          return item.name.trim() === stripped.trim();
        }))
      });

      obj.campaign.value.campaignLocs.forEach(loc => {
        selectedLocs.push(obj.allLocations.find(item => {
          let stripped = loc.replace(/\s+$/, "");
          return item.name.trim() === stripped.trim();
        }))
      });

      let newCamp = new Campaign({ 
        name: obj.campaign.value.campaignName, 
        description: obj.campaign.value.campaignDesc,
        characters: selectedChars,
        locations: selectedLocs
      });

      obj.service.addCampaign(newCamp).then(() => {
        obj.callback('load');
      });
    }
  }
}

