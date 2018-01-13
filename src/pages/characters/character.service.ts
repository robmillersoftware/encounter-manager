import { Injectable } from '@angular/core';
import { CharacterView } from './views/character-view';
import { CharacterList } from './views/character-list/character-list';

@Injectable()
export class CampaignService {
  getViews() {
    return [
      new CharacterView(CharacterList, 'Edit', {})
    ];
  }
}
