import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '@shared/objects';

@Component({
    selector: 'message-bubble',
    templateUrl: 'message-bubble.html',
})
export class MessageBubble {
    private _message: Message;
    private _local: boolean;

    constructor (public navCtrl: NavController) {}

    @Input()
    set message(msg: Message) {
        this._message = msg;
    }

    get message() {
        return this._message;
    }

    @Input()
    get local() {
      return this._local;
    }

    set local(isLocal: boolean) {
      this._local = isLocal;
    }
}
