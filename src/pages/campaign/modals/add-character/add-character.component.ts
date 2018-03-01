import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CharacterService, CampaignService } from '@shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Character, Campaign } from '@shared/objects';

class CharCheckbox {
  constructor(public character: Character, public state: Boolean = false) {}
}

@Component({
  selector: 'page-add-character',
  templateUrl: 'add-character.html'
})
export class AddCharacterModal {
  public characters: FormGroup;
  public availableChars: Array<CharCheckbox>;
  public campaign: Campaign;

  constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
      public campaignService: CampaignService, public characterService: CharacterService) {
    this.availableChars = new Array();
    this.getCharacters();
  }

  async getCharacters() {
    this.characterService.getCharacters().then(characters => {
      this.campaignService.getCurrentCampaign().then(campaign => {
        this.campaign = campaign;
        let available = Array.from(characters.values())
          .filter((char: any) =>
            campaign.characters.findIndex(c => c.name === char.name) < 0);

        available.forEach((char: any) => {
          this.availableChars.push(new CharCheckbox(char));
        });
      });
    });
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  addCharacters() {
    let obj = this;
    this.availableChars.forEach((char, idx) => {
      if (char.state) {
        obj.campaign.characters.push(char.character);
        this.availableChars.splice(idx, 1);
      }
    });

    this.campaignService.updateCampaign(this.campaign).then(() => {
      obj.closeModal(true);
    });
  }
}