import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { P2PMessage, P2PMessageFactory, MessageTypes } from '@networking/p2p';
import { CommsManager } from '@networking/comms';

@Injectable()
export class P2PNetworkManager {
  private peers: Array<string>;

  constructor(private commsManager: CommsManager, private events: Events) {
    this.commsManager.setReceiveHandler(this.receive.bind(this));
  }

  public discover() {
    this.commsManager.startDiscovery();
  }

  public stopDiscovery() {
    this.commsManager.stopDiscovery();
  }

  public join(hostAddress: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.commsManager.connect(hostAddress).then(networkData => {
        //Adds all peer addresses to the list removing duplicates
        this.peers = Array.from(new Set(this.peers.concat(...networkData.peers)));
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  public leave() {
    this.commsManager.disconnect();
    this.peers = new Array<string>();
  }

  public send(addresses: string[], message: string) {
    this.commsManager.send(addresses, message);
  }

  public receive(message: string) {
    console.log('Received message: ' + message);
    let msgObject: P2PMessage = P2PMessageFactory.fromJSON(message);

    switch(msgObject.type) {
      case MessageTypes.JOIN:
        this.addPeer(msgObject.source);
        break;
      case MessageTypes.LEAVE:
        this.removePeer(msgObject.source);
        break;
      case MessageTypes.ROUTING:
        let newRoutes = JSON.parse(msgObject.message);
        this.handleRoutingTableUpdate(newRoutes);
        break;
      //The rest of these message types need to be propagated to the rest of the application
      case MessageTypes.MESSAGE:
        this.events.publish('network-message', { source: msgObject.source, message: msgObject.message });
        break;
      case MessageTypes.DISCOVERED:
        this.events.publish('network-discovered', { source: msgObject.source, name: msgObject.message });
        break;
    }
  }

  public advertise(message: string) {
    this.commsManager.advertise(P2PMessageFactory.createAdvertisementJson(message));
  }

  public stopAdvertising() {
    this.commsManager.stopAdvertising();
  }

  public addPeer(address: string) {
    if (!this.peers.includes(address)) {
      this.commsManager.connect(address);
      this.peers.push(address);
      this.sendRoutingTableUpdate();
    }
  }

  public removePeer(address: string) {
    if (this.peers.includes(address)) {
      this.commsManager.disconnect(address);
      this.peers.splice(this.peers.indexOf(address), 1);
      this.sendRoutingTableUpdate();
    }
  }

  /**
  * Accepts a new routing table and attempts to combine it with the existing one.
  * Duplicate entries are discarded and GUID conflicts are resolved.
  * @param routes the new table
  */
  private async handleRoutingTableUpdate(peers: Array<string>) {
    let newPeers = Array.from(new Set(this.peers.concat(peers)));
    newPeers.sort();
    this.peers.sort();
    let differences = newPeers.filter((address, idx, self) => self[idx] !== this.peers[idx]);

    let statuses = differences.map((peer, idx) => {
      return this.commsManager.connect(peer).then(status => {
        if (status !== 'keep') {
          newPeers.splice(idx, 1);
        }
      });
    });

    await Promise.all(statuses);
    if (differences.length > 0) {
      this.sendRoutingTableUpdate();
    }
  }

  /**
  * Sends the latest routing table to peers.
  */
  public sendRoutingTableUpdate() {
    this.commsManager.send(this.peers, P2PMessageFactory.createRoutingJson(JSON.stringify(this.peers)));
  }
}
