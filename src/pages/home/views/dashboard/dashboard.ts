import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { HomeService } from '@pages/home/home.service';
import { Campaign } from '@shared/objects';
import { CampaignService } from '@shared/services';

/**
* This class represents the dashboard, which is the hub of the home page
* @author Rob Miller
* @copyright 2018
*/
@Component({
  templateUrl: './dashboard.html'
})
export class Dashboard implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() id: any;
  @Input() callback: any;

  //These are the various buttons
  public campaignTiles: Array<Object> = HomeService.campaignTiles;
  public characterTiles: Array<Object> = HomeService.characterTiles;
  public locationTiles: Array<Object> = HomeService.locationTiles;

  //Are there any campaigns in local storage?
  private hasCampaigns: boolean;

  constructor(private campaignService: CampaignService) {
    //Tell the campaign service to query campaigns then subscribe in case the
    //last campaign gets deleted
    this.campaignService.getCampaigns().then(() => {
      this.campaignService.hasCampaigns.subscribe(val => {
          this.hasCampaigns = val;
      });
    });
  }

  /**
  * Callback for navigation between views or tabs
  * @param data an object containing any data necessary for the navigation method
  */
  navTo(data: any) {
    if (data.changeTab) {
      this.callback('tabChange', data.tabName);
    } else {
      this.callback('viewChange', data.page + '-' + data.state);
    }
  }
}
