import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Globals } from '../../globals';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  headerData: any;
  campaignTiles: Array<Object> = Globals.campaignTiles;
  characterTiles: Array<Object> = Globals.characterTiles;
  locationTiles: Array<Object> = Globals.locationTiles;

  constructor(public navCtrl: NavController) {
    this.headerData = { title: "Encounter Manager" };
  }

  navToCampaign(data) {
    this.navCtrl.push('CampaignPage', data);
  }

  navToCharacters(data) {
    this.navCtrl.push('Characters', data);
  }

  navToLocations(data) {
    this.navCtrl.push('Locations', data);
  }
}
