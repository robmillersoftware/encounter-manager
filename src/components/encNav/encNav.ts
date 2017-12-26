import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'enc-nav',
    templateUrl: 'encNav.html',
})
export class EncNavbar {
    headerData: any;

    constructor (public navCtrl: NavController) {}

    @Input()
    set header(headerData: any) {
        this.headerData = headerData;
    }

    get header() {
        return this.headerData;
    }
}