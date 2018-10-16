import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { P2PNetworkManager } from '@networking/p2p';
import { SyncService } from '@networking';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NetworkingService {
  private networkPeers: BehaviorSubject<Array<any>>;
  private availableNetworks: BehaviorSubject<Map<string, string>>;

  //Holds the last message to come through the network. Key is origin, value is contents
  private latestMessage: BehaviorSubject<Map<string, string>>;

  constructor(private events: Events, private network: P2PNetworkManager, private syncService: SyncService) {
    this.availableNetworks = new BehaviorSubject(new Map<string, string>());
    this.latestMessage = new BehaviorSubject(new Map<string, string>());
    this.networkPeers = new BehaviorSubject(new Array<any>());

    //Subscribe to network events
    this.events.subscribe('network-message', this.handleMessages.bind(this));
    this.events.subscribe('network-discovered', this.handleDiscovered.bind(this));
    this.events.subscribe('network-lost', this.handleLostNetwork.bind(this));
    this.events.subscribe('network-sync', this.handleSync.bind(this));
    this.events.subscribe('peer-joined', this.handlePeerJoined.bind(this));
    this.events.subscribe('peer-left', this.handlePeerLeft.bind(this));

    //Send syncs across the network when a campaign is updated on the client
    this.syncService.subscribeToClientSync('campaign', campaign => {
      this.network.sync('campaign', campaign);
    });
  }

  public discover() {
    this.network.discover();
  }

  public stopDiscovery() {
    this.network.stopDiscovery();
  }

  public joinNetwork(name:string, message: string) {
    this.network.join(name, message);
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

  public sendMessage(endpoints: string[], msg: string) {
    this.network.send(endpoints, msg);
  }

  private handleMessages(data: any) {
    console.log("Received message from " + data.source + ". Content is " + data.message);
  }

  private handleDiscovered(data: any) {
    console.log("Discovered endpoint " + data.source + " broadcasting: " + data.broadcast);
    let remotes: Map<string, string> = this.availableNetworks.value;
    remotes.set(data.source, data.broadcast);
    this.availableNetworks.next(remotes);
  }

  private handleLostNetwork(data: any) {
    console.log("Discovered endpoint lost: " + data.source);
    let remotes: Map<string, string> = this.availableNetworks.value;
    remotes.delete(data.source);
    this.availableNetworks.next(remotes);
  }

  private handlePeerJoined(data: any) {
    console.log("Peer joined with endpoint: " + data.source);
    let peers: Array<any> = this.networkPeers.value;
    peers.push({ name: data.name, endpoint: data.source });
    this.networkPeers.next(peers);
  }

  private handlePeerLeft(data: any) {
    console.log("Connection lost with peer at endpoint: " + data.source);
    let peers: Array<string> = this.networkPeers.value;
    peers.splice(peers.indexOf(data.source), 1);
    this.networkPeers.next(peers);
  }

  private handleSync(data: any) {
    console.log('Sync object received: ' + data.object);
    let syncObj = JSON.parse(data.object);
    this.syncService.updateSyncedObject(syncObj.name, syncObj.json, false);
  }

  public subscribeToMessages(callback: any) {
    this.latestMessage.subscribe(callback);
  }

  public subscribeToNetworks(callback: any) {
    this.availableNetworks.subscribe(callback);
  }

  public subscribeToPeers(callback: any) {
    this.networkPeers.subscribe(callback);
  }
}
