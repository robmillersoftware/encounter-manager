import { Injectable } from '@angular/core';
import { CharacterView } from './views/character-view';
import { CharacterList } from './views/character-list/character-list';
import { CharacterNew } from './views/character-new/character-new';

@Injectable()
export class CharacterService {
  getViews() {
    return [
      new CharacterView(CharacterList, 'Edit', {}),
      new CharacterView(CharacterNew, 'New', {})
    ];
  }
}
