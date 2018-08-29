import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { P2PNetworkManager } from '@networking/p2p';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NetworkingService {
  private availableNetworks: BehaviorSubject<Map<string, string>>;

  //Holds the last message to come through the network. Key is origin, value is contents
  private latestMessage: BehaviorSubject<Map<string, string>>;

  constructor(private events: Events, private network: P2PNetworkManager) {
    //Subscribe to network receive events
    this.events.subscribe('network-message', this.handleMessages);
    this.events.subscribe('network-discovered', this.handleDiscovered);
  }

  public discover() {
    this.network.discover();
  }

  public stopDiscovery() {
    this.network.stopDiscovery();
  }

  public joinNetwork(name:string): Promise<boolean> {
    return this.network.join(this.availableNetworks.value.get(name)).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  public leaveNetwork() {
    this.network.leave();
  }

  public advertise(msg: string) {
    this.network.advertise(msg);
  }

  public stopAdvertising() {
    this.network.stopAdvertising();
  }
  public sendMessage(endpoints: string[], msg: string) {}
  private handleMessages(data: any) {
    console.log("Received message from " + data.source + ". Content is " + data.message);
  }

  private handleDiscovered(data: any) {
    console.log("Discovered endpoint " + data.source + " with name: " + data.name);
  }

  public subscribeToMessages(callback: any) {
    this.latestMessage.subscribe(callback);
  }

  public subscribeToNetworks(callback: any) {
    //Only return names. Client shouldn't need to know about addresses
    this.availableNetworks.subscribe(networks => {
      callback(Array.from(networks.keys()));
    });
  }
}
