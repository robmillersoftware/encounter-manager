/**
* This class wraps the Cordova Nearby Plugin
*/
import { Platform } from 'ionic-angular';
import { Broadcaster } from '@ionic-native/broadcaster';
import { Globals, ServiceInjector } from '@globals';
import { Protocol } from '@networking/comms';

export class Nearby implements Protocol{
  public isAdvertising: boolean = false;
  public isDiscovering: boolean = false;

  private platform: Platform;
  private broadcaster: Broadcaster;

  constructor(isMock: boolean = false) {
    //Use service injector so this class can be instantiated manually
    this.broadcaster = ServiceInjector.get(Broadcaster);
    this.platform = ServiceInjector.get(Platform);

    this.platform.ready().then(() => {
      /**
      * The service ID must be set before the NearbyPlugin can be used. The service ID
      * is hardcoded into the APK at release and is the same for all devices running this app
      * It should only change between versions.
      */
      window["NearbyPlugin"].initialize(isMock);
      window["NearbyPlugin"].setServiceId(Globals.serviceId);
    });

    console.log("Nearby Service initialized.");
  }

  /**
  * Registers a callback to handle any messages coming through the Nearby plugin
  * @param callback a function that takes a JSON object as a parameter
  */
  public setConnectionHandler(callback: any) {
    console.log("Setting up connection handler.");
    this.broadcaster.addEventListener('connection').subscribe(callback);
  }

  public setDiscoveryHandler(callback: any) {
    console.log("Setting up discovery handler.");
    this.broadcaster.addEventListener('discovery').subscribe(callback);
  }

  public setPayloadHandler(callback: any) {
    console.log("Setting up payload handler.");
    this.broadcaster.addEventListener('payload').subscribe(callback);
  }

  public advertise(msg: string) {
    if (this.isAdvertising) {
      this.stopAdvertising();
    }

    window["NearbyPlugin"].startAdvertising(msg);
    this.isAdvertising = true;
  }

  /**
  * Stop advertising the current broadcast
  */
  public stopAdvertising() {
    console.log("Stopping advertising");
    window["NearbyPlugin"].stopAdvertising();
    this.isAdvertising = false;
  }

  /**
  * Listen for broadcasts from this service ID
  */
  public discover() {
    if (this.isDiscovering) {
      this.stopDiscovery();
    }

    window["NearbyPlugin"].startDiscovery();
    this.isDiscovering = true;
  }

  /**
  * Stop the Nearby plugin from looking for campaigns
  */
  public stopDiscovery() {
    console.log("Stopping discovery");
    window["NearbyPlugin"].stopDiscovery();
    this.isDiscovering = false;
  }

  /**
  * Connects to a remote campaign with the specified name
  * @param name
  */
  public connect(endpoint: string, message: string) {
    window["NearbyPlugin"].connect(endpoint);
  }

  /**
  * Disconnect from the given endpoint
  * @param endpoint the address to disconnect from
  */
  public disconnect(endpoint: string) {
    window["NearbyPlugin"].disconnect(endpoint);
  }

  public disconnectAll() {
    window["NearbyPlugin"].disconnectAll();
  }

  /**
  * Add a new message to a conversation
  *
  * @param message A message object containing what was sent
  * @param players a list of players to send it to
  */
  public send(endpoints: string[], message: string) {
    console.log("Sending payload: " + message + ", to endpoints: " + endpoints.join(","));
    window["NearbyPlugin"].send(JSON.stringify(endpoints), message);
  }
}
