import { Component, Input, NgZone } from '@angular/core';
import { ModalController, Events } from 'ionic-angular';
import { HomeViewComponent } from '../home-view.component';
import { HomeService } from '@pages/home/home.service';
import { CampaignStorage, CharacterStorage, LocationService } from '@shared/persistence';
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
  private hasCharacters: boolean;
  private hasLocations: boolean;

  private hideOverlay: boolean = true;

  constructor(public modalCtrl: ModalController, public events: Events,
      public campaignStorage: CampaignStorage, public characterStorage: CharacterStorage,
      public locationService: LocationService, public zone: NgZone) {
    this.campaignStorage.campaigns.subscribe(val => {
      if (val && val.size > 0) {
        this.hasCampaigns = true;
      } else {
        this.hasCampaigns = false;
      }
    });

    this.characterStorage.characterSubject.subscribe(val => {
      this.zone.run(() => {
        this.hasCharacters = val.size > 0;
      });
    });

    this.locationService.locationSubject.subscribe(val => {
      this.zone.run(() => {
        this.hasLocations = val.size > 0;
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
