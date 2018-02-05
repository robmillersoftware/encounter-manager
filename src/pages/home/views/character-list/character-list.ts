import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { CharacterService } from '../../../../shared/services';
import { Character } from '../../../../shared/objects/character';

@Component({
  templateUrl: './character-list.html'
})
export class CharacterList implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  
  public characters: Character[];

  constructor(private characterService: CharacterService) {
    this.getCharacters();
  }

  getTitle() {
    return "Edit Characters";
  }
  
  async getCharacters() {
    let map = await this.characterService.getCharacters();
    this.characters = Array.from(map.values());
  }

  deleteCharacter(name: string) {
    let idx = this.characters.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.characters.splice(idx, 1);
      this.characterService.removeCharacter(name);
    }
  }
}

