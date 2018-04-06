import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { CampaignService, UserService, CharacterService, LocationService } from '@shared/services';
import { CampaignFactory, PlayerFactory, Location, Character } from '@shared/objects';
import { generateIdentifier } from '@globals';

@Component({
  templateUrl: './campaign-new.html'
})
export class CampaignNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaign: FormGroup;
  public submitAttempted: boolean;

  private allCharacters: Array<Character>;
  private allLocations: Array<Location>;

  constructor(private campaignService: CampaignService, private userService: UserService,
      private characterService: CharacterService, private locationService: LocationService,
      private formBuilder: FormBuilder) {
    this.campaign = this.formBuilder.group({
      campaignName: ['', Validators.required],
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
    let map: Map<string, Character> = await this.characterService.getCharacters();
    this.allCharacters = Array.from(map.values());
  }

  async getLocations() {
    let map: Map<string, Location> = await this.locationService.getLocations();
    this.allLocations = Array.from(map.values());
  }

  async createCampaign() {
    let obj = this;
    let selectedChars = new Array<Character>();
    let selectedLocs = new Array<Location>();

    if (obj.campaign.value.campaignChars) {
      obj.campaign.value.campaignChars.forEach(char => {
        obj.allCharacters.forEach(item => {
          let stripped = char.replace(/\s+$/, "");
          if (item.name.trim() === stripped.trim()) {
            selectedChars.push(item);
          }
        });
      });
    }

    if (obj.campaign.value.campaignLocs) {
      obj.campaign.value.campaignLocs.forEach(loc => {
        obj.allLocations.forEach(item => {
          let stripped = loc.replace(/\s+$/, "");
          if (item.name.trim() === stripped.trim()) {
            selectedLocs.push(item);
          }
        });
      });
    }

    let identifier = await this.userService.getIdentifier();
    let gm = PlayerFactory.createPlayer(identifier, true, null);

    let newCamp = CampaignFactory.createCampaign(
      obj.campaign.value.campaignName,
      obj.campaign.value.campaignDesc,
      selectedChars,
      selectedLocs,
      [gm]);

    obj.campaignService.addCampaign(newCamp).then(() => {
      obj.callback('pageChange', 'campaign-load');
    });
  }
}
