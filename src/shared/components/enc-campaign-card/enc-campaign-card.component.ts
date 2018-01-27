import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Campaign } from '../../objects/campaign';

@Component({
    selector: 'enc-campaign-card',
    templateUrl: 'enc-campaign-card.html',
})
export class EncCampaignCard {
    private _campaign: Campaign;

    constructor (public navCtrl: NavController) {}

    @Input()
    set campaign(c:Campaign) {
        this._campaign = c;
    }

    get campaign() {
        return this._campaign;
    }
}