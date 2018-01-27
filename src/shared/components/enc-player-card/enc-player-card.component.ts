import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Player } from '../../objects/player';

@Component({
    selector: 'enc-player-card',
    templateUrl: 'enc-player-card.html',
})
export class EncPlayerCard {
    private _player: Player;

    constructor (public navCtrl: NavController) {}

    @Input()
    set player(p:Player) {
        this._player = p;
    }

    get player() {
        return this._player;
    }
}