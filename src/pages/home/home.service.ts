import { Injectable } from '@angular/core';
import { HomeView, CharacterList, CharacterNew, LocationList,
  LocationNew, Dashboard, CampaignNew, CampaignJoin, CampaignLoad } from './views';

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
