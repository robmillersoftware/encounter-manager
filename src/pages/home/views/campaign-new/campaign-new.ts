import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { HomeViews } from '@pages/home/home.service';

import { UserStorage } from '@shared/persistence';
import { GameService, CampaignService, CharacterService, LocationService } from '@shared/services';

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

  constructor(private campaignService: CampaignService, private userStorage: UserStorage,
      private characterService: CharacterService, private locationService: LocationService,
      private formBuilder: FormBuilder, private gameService: GameService) {
    this.campaignInfo = this.formBuilder.group({
      campaignName: ['', Validators.required],
      campaignDesc: [''],
      campaignChars: [''],
      campaignLocs: ['']
    });

    this.allCharacters = Array.from(this.characterService.getCharacters().values());
    this.allLocations = Array.from(this.locationService.getLocations().values());
  }

  /**
  * Submit callback that creates a campaign in local storage
  */
  public async createCampaign() {
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
    let user = await this.userStorage.getUser();

    //Create a GM
    let gm = PlayerFactory.createPlayer(user.name, user.uuid, null);
    let game = this.gameService.getGame('None');

    //Create a new Campaign object
    let newCamp = CampaignFactory.createCampaign(
      this.campaignInfo.value.campaignName,
      game,
      this.campaignInfo.value.campaignDesc,
      gm,
      selectedChars,
      selectedLocs);

    this.campaignService.createCampaign(newCamp);
    this.callback({newView: HomeViews.CAMPAIGN_LOAD});
  }
}
