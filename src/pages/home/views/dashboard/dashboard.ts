import { Component, Input, NgZone } from '@angular/core';
import { ModalController, Events } from 'ionic-angular';
import { HomeViewComponent } from '../home-view.component';
import { HomeService } from '@pages/home/home.service';
import { CampaignService } from '@shared/services';
import { AccountSettingsModal } from '@shared/components';

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
  private hideOverlay: boolean = true;
  
  constructor(public modalCtrl: ModalController, public events: Events,
      public campaignService: CampaignService, public zone: NgZone) {
    this.campaignService.hasCampaigns.subscribe(val => {
      this.zone.run(() => {
        this.hasCampaigns = val;
      });
    });

    this.events.subscribe('Account', () => {
      let modal = this.modalCtrl.create(AccountSettingsModal);
      this.hideOverlay = false;
      modal.present();
      modal.onDidDismiss(() => {
          this.hideOverlay = true;
      });
    });
  }

  /**
  * Callback for navigation between views or tabs
  * @param data an object containing any data necessary for the navigation method
  */
  navTo(id: any) {
    this.callback('viewChange', id);
  }
}
