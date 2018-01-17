import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';

//Import pages for navigation through menu
import { HomePage } from '../pages/home/home.component';
import { CampaignPage } from '../pages/campaign/campaign.component';
import { CharacterPage } from '../pages/characters/character.component';
import { LocationPage } from '../pages/locations/location.component';
import { OptionsPage } from '../pages/options/options.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;

  rootPage: any;
  homePage: any;
  campaignPage: any;
  optionsPage: any;
  characterPage: any;
  locationPage: any;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      this.homePage = HomePage;
      this.campaignPage = CampaignPage;
      this.optionsPage = OptionsPage;
      this.characterPage = CharacterPage;
      this.locationPage = LocationPage;

      this.rootPage = HomePage;
    });
  }

  openPage(page: any, data: any) {
    this.nav.setRoot(page, data);
  }
}

