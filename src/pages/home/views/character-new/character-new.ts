import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { CharacterService } from '@shared/services';
import { CharacterFactory } from '@shared/objects';

/**
* This class represents the view for creating a new character
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './character-new.html'
})
export class CharacterNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public characterInfo: FormGroup;

  constructor(private characterService: CharacterService, private formBuilder: FormBuilder) {
    this.characterInfo = this.formBuilder.group({
      charName: ['', Validators.required],
      charDesc: ['']
    });
  }

  /**
  * Submit callback that creates a new character and adds it to local storage
  */
  private createCharacter() {
    let char = CharacterFactory.createCharacter(this.characterInfo.value.charName, this.characterInfo.value.charDesc);

    this.characterService.addCharacter(char).then(() => {
      this.callback('viewChange', 'character-edit');
    });
  }
}
