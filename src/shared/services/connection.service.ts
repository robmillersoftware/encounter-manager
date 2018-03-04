import { Injectable, NgZone } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { Globals } from '@globals';

@Injectable()
export class ConnectionService {
    private isIos: boolean;
    private isCordova: boolean;

    constructor(private platform: Platform,
            private diag: Diagnostic)
    {
        this.isIos = this.platform.is("ios");
        this.isCordova = this.platform.is("cordova");

        // check native BLE access
        if (this.isCordova) {
            //enable bluetooth
        }
    }
}