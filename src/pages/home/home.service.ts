import { Injectable } from '@angular/core';
import { HomeView } from './views/home-view';
import { CharacterList } from './views/character-list/character-list';
import { CharacterNew } from './views/character-new/character-new';
import { LocationList } from './views/location-list/location-list';
import { LocationNew } from './views/location-new/location-new';
import { Dashboard } from './views/dashboard/dashboard';
import { CampaignNew } from './views/campaign-new/campaign-new';
import { CampaignJoin } from './views/campaign-join/campaign-join';
import { CampaignLoad } from './views/campaign-load/campaign-load';

@Injectable()
export class HomeService {
  getViews() {
    return [
      new HomeView(CharacterList, 'character-edit', {}),
      new HomeView(CharacterNew, 'character-new', {}),
      new HomeView(LocationList, 'location-edit', {}),
      new HomeView(LocationNew, 'location-new', {}),
      new HomeView(CampaignNew, 'campaign-new', {}),
      new HomeView(CampaignJoin, 'campaign-join', {}),
      new HomeView(CampaignLoad, 'campaign-load', {}),
      new HomeView(Dashboard, 'dashboard', {})
    ];
  }
}
