import { Injectable } from '@angular/core';
import { iBeacon, BLE } from '@ionic-native'

class BTDevice {
    name: string,
    uuid: string,
    rssi: number,
    advertising: any
}

@Injectable()
export class BluetoothService {
    
    private devices: Set<BTDevice>;
    
    constructor(private ble: BLE) {
        startScan();
    }

    async startScan() {
        ble.startScan([], (success: BTDevice) => {
            devices.add(success);
        }, failure => {
            console.log(failure);
        });
        
        setTimeout(ble.stopScan, 30000,
            () => console.log("Scan finished"),
            () => console.log("stopScan failed!"));
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