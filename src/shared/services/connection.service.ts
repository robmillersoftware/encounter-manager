import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon';
import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';

export enum ConnectionState {
    DISCONNECTED,
    CONNECTED
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
    constructor(
        private devices: Set<BTDevice> = new Set(),
        private state: ConnectionState = ConnectionState.DISCONNECTED,
        private type: ConnectionType = ConnectionType.BLUETOOTH,
        private ble: BLE,
        private diag: Diagnostic) {
            this.diag.isBluetoothAvailable().then(
                () => this.type = ConnectionType.BLUETOOTH,
                () => this.type = ConnectionType.WIFI);
        }

    async startScan() {
        if (this.type == ConnectionType.BLUETOOTH) {
            this.btScan();
        } else if (this.type == ConnectionType.WIFI) {
            this.wifiScan();
        }
    }

    btScan() {
        this.ble.startScan([]).subscribe((success: BTDevice) => {
            this.devices.add(success);
        }, failure => {
            console.log(failure);
        });
        
        setTimeout(this.ble.stopScan, 30000,
            () => console.log("Scan finished"),
            () => console.log("stopScan failed!"));
    }    
    
    wifiScan() {}
    
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