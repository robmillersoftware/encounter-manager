import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'enc-tile',
    templateUrl: 'enc-tile.html',
})
export class EncTile {
    tileData: any = {};

    constructor (public navCtrl: NavController) {}

    @Input()
    set image(uri:string) {
        this.tileData.image = uri;
    }

    get image() {
        return this.tileData.image;
    }

    @Input()
    set title(title:string) {
        this.tileData.title = title;
    }

    get title() {
        return this.tileData.title;
    }

    @Input()
    set data(data:object) {
        this.tileData.data = data;
    }

    get data() {
        return this.tileData.data;
    }
}
