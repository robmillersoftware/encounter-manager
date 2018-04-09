import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { CampaignService, UserService, CharacterService, LocationService } from '@shared/services';
import { CampaignFactory, PlayerFactory, Location, Character } from '@shared/objects';

/**
* This class represents the view for creating new characters
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './campaign-new.html'
})
export class CampaignNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public campaignInfo: FormGroup;

  //The lists of chraacters and locations retrieved from local storage
  private allCharacters: Array<Character>;
  private allLocations: Array<Location>;

  constructor(private campaignService: CampaignService, private userService: UserService,
      private characterService: CharacterService, private locationService: LocationService,
      private formBuilder: FormBuilder) {
    this.campaignInfo = this.formBuilder.group({
      campaignName: ['', Validators.required],
      campaignDesc: [''],
      campaignChars: [''],
      campaignLocs: ['']
    });

    this.getCharacters();
    this.getLocations();
  }

  /**
  * Retrieve a list of characters from local storage
  */
  private async getCharacters() {
    let map: Map<string, Character> = await this.characterService.getCharacters();
    this.allCharacters = Array.from(map.values());
  }

  /**
  * Retrieve a list of locations from local storage
  */
  private async getLocations() {
    let map: Map<string, Location> = await this.locationService.getLocations();
    this.allLocations = Array.from(map.values());
  }

  /**
  * Submit callback that creates a campaign in local storage
  */
  private async createCampaign() {
    let selectedChars = new Array<Character>();
    let selectedLocs = new Array<Location>();

    //Generate the list of selected characters
    if (this.campaignInfo.value.campaignChars) {
      this.campaignInfo.value.campaignChars.forEach(char => {
        this.allCharacters.forEach(item => {
          let stripped = char.replace(/\s+$/, "");
          if (item.name.trim() === stripped.trim()) {
            selectedChars.push(item);
          }
        });
      });
    }

    //Generate the list of selected locations
    if (this.campaignInfo.value.campaignLocs) {
      this.campaignInfo.value.campaignLocs.forEach(loc => {
        this.allLocations.forEach(item => {
          let stripped = loc.replace(/\s+$/, "");
          if (item.name.trim() === stripped.trim()) {
            selectedLocs.push(item);
          }
        });
      });
    }

    //Create an identifier
    let identifier = await this.userService.getIdentifier();

    //Create a GM
    let gm = PlayerFactory.createPlayer(identifier, true, null);

    //Create a new Campaign object
    let newCamp = CampaignFactory.createCampaign(
      this.campaignInfo.value.campaignName,
      this.campaignInfo.value.campaignDesc,
      selectedChars,
      selectedLocs,
      [gm]);

    this.campaignService.addCampaign(newCamp).then(() => {
      this.callback('viewChange', 'campaign-load');
    });
  }
}
