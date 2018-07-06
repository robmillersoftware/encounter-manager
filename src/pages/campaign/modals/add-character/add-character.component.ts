import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CharacterStorage, CampaignStorage } from '@shared/persistence';
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
      public campaignStorage: CampaignStorage, public characterStorage: CharacterStorage) {
    this.availableChars = new Array();
    this.campaign = this.campaignStorage.getCurrentCampaign();
    this.getCharacters();
  }

  public getCharacters() {
    let characters: Map<string, Character> = this.characterStorage.getCharacters();
    let available = Array.from(characters.values()).filter((char: any) =>
      this.campaign.characters.findIndex(c => c.name === char.name) < 0);

    available.forEach((char: any) => {
      this.availableChars.push(new CharCheckbox(char));
    });
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  addCharacters() {
    this.availableChars.forEach((char, idx) => {
      if (char.state) {
        this.campaign.characters.push(char.character);
        this.availableChars.splice(idx, 1);
      }
    });

    this.campaignStorage.updateCampaign(this.campaign);
    this.closeModal(true);
  }
}
