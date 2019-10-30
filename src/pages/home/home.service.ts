import { Injectable } from '@angular/core';
import { HomeView, CharacterEdit, CharacterNew, LocationEdit,
  LocationNew, Dashboard, CampaignNew, CampaignJoin, CampaignLoad } from './views';
import { HeaderData } from '@shared/objects';

/**
* Enumerates the various home page views
*/
export enum HomeViews {
  DASHBOARD,
  CAMPAIGN_JOIN,
  CAMPAIGN_NEW,
  CAMPAIGN_LOAD,
  CHARACTER_NEW,
  CHARACTER_EDIT,
  LOCATION_NEW,
  LOCATION_EDIT
};

/**
* This class stores the static data used by the home page
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class HomeService {
  public getViews() {
    return [
      new HomeView(CharacterEdit, 'character-edit', HomeViews.CHARACTER_EDIT,
        new HeaderData('Edit Existing Characters', true )),
      new HomeView(CharacterNew, 'character-new',  HomeViews.CHARACTER_NEW,
        new HeaderData('Create a New Character', true )),
      new HomeView(LocationEdit, 'location-edit', HomeViews.LOCATION_EDIT,
        new HeaderData('Edit Existing Locations', true )),
      new HomeView(LocationNew, 'location-new', HomeViews.LOCATION_NEW,
        new HeaderData('Create a New Location', true )),
      new HomeView(CampaignNew, 'campaign-new', HomeViews.CAMPAIGN_NEW,
        new HeaderData('Create a New Campaign', true )),
      new HomeView(CampaignJoin, 'campaign-join', HomeViews.CAMPAIGN_JOIN,
        new HeaderData('Join a Campaign', true )),
      new HomeView(CampaignLoad, 'campaign-load', HomeViews.CAMPAIGN_LOAD,
        new HeaderData('Load an Existing Campaign', true )),
      new HomeView(Dashboard, 'dashboard', HomeViews.DASHBOARD,
        new HeaderData('RetConnected', false, true,
          ['Account', 'Settings', 'Test'] ))
    ];
  }

  //These objects contain static information for the dashboard UI buttons
  public static campaignTiles: Array<Object> = [
    {title: 'Join', image: '', id: HomeViews.CAMPAIGN_JOIN},
    {title: 'New', image: '', id: HomeViews.CAMPAIGN_NEW},
    {title: 'Load', image: '', id: HomeViews.CAMPAIGN_LOAD}
  ];

  public static characterTiles: Array<Object> = [
    {title: 'Create', image: '', id: HomeViews.CHARACTER_NEW},
    {title: 'View/Edit', image: '', id: HomeViews.CHARACTER_EDIT}
  ];

  public static locationTiles: Array<Object> = [
    {title: 'Create', image: '', id: HomeViews.LOCATION_NEW},
    {title: 'View/Edit', image: '', id: HomeViews.LOCATION_EDIT}
  ];
}
