/**
* This class wraps the Cordova Nearby Plugin
*/
import { Platform } from 'ionic-angular';
import { Globals, ServiceInjector } from '@globals';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Protocol } from '@networking/comms';

export class Nearby implements Protocol{
  public isAdvertising: boolean = false;
  public isDiscovering: boolean = false;

  private platform: Platform;

  //The NearbyPlugin window object
  private plugin: any;

  constructor() {
    this.platform = ServiceInjector.get(Platform);
    this.platform.ready().then(() => {
      this.plugin = window["NearbyPlugin"];

      /**
      * The service ID must be set before the NearbyPlugin can be used. The service ID
      * is hardcoded into the APK at release and is the same for all devices running this app
      * It should only change between versions.
      */
      this.plugin.setServiceId(Globals.serviceId);
    });

    console.log("Nearby Service initialized.");
  }

  /**
  * Registers a callback to handle any messages coming through the Nearby plugin
  * @param callback a function that takes a JSON object as a parameter
  */
  public setReceiveHandler(callback: any) {
    this.plugin.setDataHandler(callback);
  }

  public advertise(msg: string) {
    if (this.isAdvertising) {
      this.stopAdvertising();
    }

    this.plugin.startAdvertising(msg);
    this.isAdvertising = true;
  }

  /**
  * Stop advertising the current broadcast
  */
  public stopAdvertising() {
    console.log("Stopping advertising");
    this.plugin.stopAdvertising();
    this.isAdvertising = false;
  }

  /**
  * Listen for broadcasts from this service ID
  */
  public discover() {
    if (this.isDiscovering) {
      this.stopDiscovery();
    }

    this.plugin.startDiscovery();
    this.isDiscovering = true;
  }

  /**
  * Stop the Nearby plugin from looking for campaigns
  */
  public stopDiscovery() {
    console.log("Stopping discovery");
    this.plugin.stopDiscovery();
    this.isDiscovering = false;
  }

  /**
  * Connects to a remote campaign with the specified name
  * @param name
  */
  public connect(endpoint: string) {
      this.plugin.connect(endpoint);
  }

  /**
  * Disconnect from the given endpoint
  * @param endpoint the address to disconnect from
  */
  public disconnect(endpoint: string) {
    this.plugin.disconnect(endpoint);
  }

  public disconnectAll() {
    this.plugin.disconnectAll();
  }

  /**
  * Add a new message to a conversation
  *
  * @param message A message object containing what was sent
  * @param players a list of players to send it to
  */
  public send(endpoints: string[], message: string) {
    this.plugin.send(JSON.stringify(endpoints), message);
  }
}
