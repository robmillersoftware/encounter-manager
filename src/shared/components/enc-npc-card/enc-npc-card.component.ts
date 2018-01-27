import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Character } from '../../objects/character';

@Component({
    selector: 'enc-npc-card',
    templateUrl: 'enc-npc-card.html',
})
export class EncNpcCard {
    private _character: Character;

    constructor (public navCtrl: NavController) {}

    @Input()
    set character(c:Character) {
        this._character = c;
    }

    get character() {
        return this._character;
    }
}