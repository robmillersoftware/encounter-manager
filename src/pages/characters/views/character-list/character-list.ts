import { Component, Input } from '@angular/core';
import { CharacterViewComponent } from '../character-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { Character } from '../../../../objects/character';

@Component({
  templateUrl: './character-list.html'
})
export class CharacterList implements CharacterViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  
  public characters: Character[];

  constructor(private storageService: StorageService) {
    this.getCharacters();
  }

  async getCharacters() {
    let map = await this.storageService.getCharacters();
    this.characters = Array.from(map.values());
  }

  deleteCharacter(name: string) {
    let idx = this.characters.findIndex(item => item.name === name);

    if (idx !== -1) {
      this.characters.splice(idx, 1);
      this.storageService.removeCharacter(name);
    }
  }
}

