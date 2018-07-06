import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { CharacterStorage } from '@shared/persistence';
import { Character } from '@shared/objects';

/**
* This class represents the character view/edit/delete view
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './character-edit.html'
})
export class CharacterEdit implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  public characters: Character[];

  constructor(private characterStorage: CharacterStorage) {
    this.characters = Array.from(this.characterStorage.getCharacters().values());
  }

  /**
  * Button callback for deleting a character from local storage
  */
  public deleteCharacter(name: string) {
    let idx = this.characters.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.characters.splice(idx, 1);
      this.characterStorage.removeCharacter(name);

      if (this.characters.length == 0) {
        this.callback();
      }
    }
  }
}
