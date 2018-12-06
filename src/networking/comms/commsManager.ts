/**
* This class wraps the various communications hardware used by this application. Currently, only Google Nearby
* is handled
*/
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Nearby, MockProtocol, Protocol } from '@networking/comms';

@Injectable()
export class CommsManager {
  public isIos: boolean;
  public isCordova: boolean;

  private protocol: Protocol;

  constructor(public platform: Platform) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");

    //We are only handling Nearby for now. If it's not found then we're just testing so mock it.
    if (this.isCordova && window['NearbyPlugin']) {
      this.protocol = new Nearby();
    } else {
      this.protocol = new MockProtocol();
    }
  }

  /**
  * This method attempts to send data to the specified endpoint
  * @param endpoint this is the endpoint to send data to. Its format will depend on the platform
  * @param message we're only sending strings for now. Use JSON for sending more complex objects.
  */
  public send(endpoints: string[], message: string) {
    this.protocol.send(endpoints, message);
  }

  /**
  * Sets the callback for handling messages coming through the network.
  * @param callback the method to call
  */
  public setConnectionCallback(callback) {
    console.log("Setting connection handler in Comms Manager");
    this.protocol.setConnectionHandler(callback);
  }

  public setDiscoveryCallback(callback) {
    console.log("Setting endpoint handler in Comms Manager");
    this.protocol.setDiscoveryHandler(callback);
  }

  public setPayloadCallback(callback) {
    console.log("Setting message handler in Comms Manager");
    this.protocol.setPayloadHandler(callback);
  }

  /**
  * Connects to the specified endpoint.
  * @param endpoint the network address to connect to
  * @return a promise containing an object with relevant connection data
  */
  public connect(endpoint: string, message: string): Promise<any> {
    return this.protocol.connect(endpoint, message);
  }

  /**
  *
  */
  public disconnect(endpoint: string = null) {
    if (!endpoint) {
      this.protocol.disconnectAll();
    } else {
      this.protocol.disconnect(endpoint);
    }
  }

  /**
  * Sends a message to every node on the network. There is a character limit.
  * @param message the message to send
  */
  public advertise(message: string) {
    this.protocol.advertise(message);
  }

  /**
  * Stops broadcasting the current message
  */
  public stopAdvertising() {
    this.protocol.stopAdvertising();
  }

  /**
  * Discovers broadcasts on the current protocol.
  * @param callback the method to call when a broadcast is found.
  */
  public startDiscovery() {
    this.protocol.discover();
  }

  /**
  * Stop trying to discover new broadcasts.
  */
  public stopDiscovery() {
    this.protocol.stopDiscovery();
  }
}
