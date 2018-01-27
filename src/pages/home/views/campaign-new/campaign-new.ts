import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { Campaign, Location, Character } from '../../../../shared/objects';

@Component({
  templateUrl: './campaign-new.html'
})
export class CampaignNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaign: FormGroup;
  public submitAttempted: boolean;

  private allCharacters: Character[];
  private allLocations: Location[];

  constructor(private storage: StorageService, private user: UserService, private formBuilder: FormBuilder) {
    this.campaign = this.formBuilder.group({
      campaignName: ['', Validators.compose[Validators.required, this.user.hasCampaign().bind(this.user)]],
      campaignDesc: [''],
      campaignChars: [''],
      campaignLocs: ['']
    });

    this.getCharacters();
    this.getLocations();
  }

  getTitle() {
    return "Create New Campaign";
  }
  
  async getCharacters() {
    let map = await this.storage.getCharacters();
    this.allCharacters = Array.from(map.values());
  }

  async getLocations() {
    let map = await this.storage.getLocations();
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

      obj.storage.addCampaign(newCamp).then(() => {
        obj.callback('pageChange', 'campaign-load');
      });
    }
  }
}

