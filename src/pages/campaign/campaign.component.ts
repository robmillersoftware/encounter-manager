import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { CampaignService } from '../../shared/services';
import { Campaign } from '../../shared/objects/index';
import { StartEncounterModal, AddCharacterModal, AddLocationModal } from './modals';

@Component({
    selector: 'page-campaign',
    templateUrl: 'campaign.html'
})
export class CampaignPage {
    campaign: Campaign;
    hideOverlay: boolean = true;

    constructor(public navCtrl: NavController, private campaignService: CampaignService, private modalCtrl: ModalController) {
        this.campaignService.campaignSubject.subscribe(c => {
            this.campaign = c;
        });
    }

    public startEncounter() {
        let modal = this.modalCtrl.create(StartEncounterModal);
        this.hideOverlay = false;
        
        modal.present();
        modal.onDidDismiss(didSubmit => {
            this.hideOverlay = true;
            if (didSubmit) {
                this.navCtrl.parent.select(2);
            }
        });
    }

    public addCharacter() {
        let modal = this.modalCtrl.create(AddCharacterModal);
        this.hideOverlay = false;
        modal.present();
        modal.onDidDismiss(() => {
            this.hideOverlay = true;
        });
    }

    public addLocation() {
        let modal = this.modalCtrl.create(AddLocationModal);
        this.hideOverlay = false;
        modal.present();
        modal.onDidDismiss(() => {
            this.hideOverlay = true;
        });
    }
}