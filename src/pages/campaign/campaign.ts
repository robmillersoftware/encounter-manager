import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-campaign',
  templateUrl: 'campaign.html'
})
export class CampaignPage {
  headerData:any;
  
  constructor(public navCtrl: NavController) {
    this.headerData = { title: "Campaign" };
  }
}
