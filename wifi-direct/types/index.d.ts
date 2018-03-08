import { Injectable } from '@angular/core';
import { Cordova, CordovaProperty, Plugin, IonicNativePlugin } from '@ionic-native/core';

export interface WifiDirect {
    echo(phrase: string);
    getDate();
}