import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Location } from '@shared/objects';

@Component({
    selector: 'enc-loc-card',
    templateUrl: 'enc-loc-card.html',
})
export class EncLocCard {
    private _location: Location;

    constructor (public navCtrl: NavController) {}

    @Input()
    set location(l:Location) {
        this._location = l;
    }

    get location() {
        return this._location;
    }
}