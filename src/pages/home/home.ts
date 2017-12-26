import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Globals } from '../../globals';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  headerData:any;
  tiles:Array<Object> = Globals.homePageCampaignTiles;

  constructor(public navCtrl: NavController) {
    this.headerData = { title: "Encounter Manager" };
  }
}
