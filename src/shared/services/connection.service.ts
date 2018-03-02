import { Injectable } from '@angular/core';
import { IBeacon, BeaconRegion, IBeaconDelegate } from '@ionic-native/ibeacon';
import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { Globals, MajorCodes, MinorCodes } from '@globals';

export enum ConnectionState {
    SEARCHING,
    BROADCASTING,
    CONNECTED,
    OFFLINE
}

export enum ConnectionType {
    BLUETOOTH,
    WIFI,
    NONE
}

class BTDevice {
    name: string;
    uuid: string;
    rssi: number;
    advertising: any;
}

@Injectable()
export class ConnectionService {
    private devices: Set<BTDevice>;
    private state: ConnectionState = ConnectionState.OFFLINE;
    private type: ConnectionType = ConnectionType.BLUETOOTH;
    private beaconRegion: BeaconRegion;
    private beaconDelegate: IBeaconDelegate;

    constructor(private platform: Platform, private ble: BLE, private ibeacon: IBeacon, private diag: Diagnostic,) {
        this.devices = new Set();

        let uuid = Globals.beaconRegionId;
        let identifier = Globals.beaconRegionName;

        this.beaconRegion = this.ibeacon.BeaconRegion(identifier, uuid);
        this.beaconDelegate = this.ibeacon.Delegate();
    }

    async startAdvertising() {
        this.ibeacon.enableBluetooth();
    }

    async lookForConnections() {
        if (this.platform.is('cordova')) {
            this.diag.isBluetoothAvailable().then(
                () => {
                    this.type = ConnectionType.BLUETOOTH
                },
                () => this.type = ConnectionType.WIFI);
        }
    }

    btScan() {
        this.state = ConnectionState.SEARCHING;
        this.ble.startScan([]).subscribe((success: BTDevice) => {

        }, failure => {
            console.log(failure);
        });
    }

    btStop() {
        this.ble.stopScan();
    }

    wifiScan() {
        this.diag.isWifiAvailable().then(() => {
            //Broadcast UDP looking for campaigns
            //Listen for TCP
        },
        () => {
            console.log("NO!!!!!");
        });
    }

    private stringToBytes(str: string) {
        let array = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i) {
            array[i] = str.charCodeAt(i);
        }
        return array.buffer;
    }

    private bytesToString(buffer: any) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }
}