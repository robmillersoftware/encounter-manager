import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Conversation } from './conversation';

@Component({
    selector: 'enc-chat',
    templateUrl: 'enc-chat.html',
})
export class EncChat {
    public conversations: Array<Conversation>;

    constructor (public navCtrl: NavController) {}
}