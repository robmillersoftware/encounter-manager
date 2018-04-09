import { Injectable } from '@angular/core';
import { HomeView, CharacterEdit, CharacterNew, LocationEdit,
  LocationNew, Dashboard, CampaignNew, CampaignJoin, CampaignLoad } from './views';

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
        { title: 'Edit Existing Characters', canGoBack: true }),
      new HomeView(CharacterNew, 'character-new',  HomeViews.CHARACTER_NEW,
        { title: 'Create a New Character', canGoBack: true }),
      new HomeView(LocationEdit, 'location-edit', HomeViews.LOCATION_EDIT,
        { title: 'Edit Existing Locations', canGoBack: true }),
      new HomeView(LocationNew, 'location-new', HomeViews.LOCATION_NEW,
        { title: 'Create a New Location', canGoBack: true }),
      new HomeView(CampaignNew, 'campaign-new', HomeViews.CAMPAIGN_NEW,
        { title: 'Create a New Campaign', canGoBack: true }),
      new HomeView(CampaignJoin, 'campaign-join', HomeViews.CAMPAIGN_JOIN,
        { title: 'Join a Campaign', canGoBack: true }),
      new HomeView(CampaignLoad, 'campaign-load', HomeViews.CAMPAIGN_LOAD,
        { title: 'Load an Existing Campaign', canGoBack: true }),
      new HomeView(Dashboard, 'dashboard', HomeViews.DASHBOARD,
        { title: 'RetConnected' })
    ];
  }

  //These objects contain static information for the dashboard UI buttons
  public static campaignTiles: Array<Object> = [
    {title: 'Join', image: '', data: { state: 'join', page: 'campaign' }},
    {title: 'New', image: '', data: { state: 'new', page: 'campaign' }},
    {title: 'Load', image: '', data: { state: 'load', page: 'campaign' }}
  ];

  public static characterTiles: Array<Object> = [
    {title: 'Create', image: '', data: { state: 'new', page: 'character' }},
    {title: 'View/Edit', image: '', data: { state: 'edit', page: 'character' }}
  ];

  public static locationTiles: Array<Object> = [
    {title: 'Create', image: '', data: { state: 'new', page: 'location' }},
    {title: 'View/Edit', image: '', data: { state: 'edit', page: 'location' }}
  ];
}
