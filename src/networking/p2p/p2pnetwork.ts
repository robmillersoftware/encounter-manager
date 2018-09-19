import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { P2PMessageFactory, MessageTypes } from '@networking/p2p';
import { CommsManager } from '@networking/comms';

@Injectable()
export class P2PNetworkManager {
  private peers: Array<string>;

  constructor(private commsManager: CommsManager, private events: Events) {
    this.commsManager.setReceiveHandler(this.receive.bind(this));
  }

  /**
  * Searches for networks to join.
  */
  public discover() {
    this.commsManager.startDiscovery();
  }

  /**
  * Turns off network discovery
  */
  public stopDiscovery() {
    this.commsManager.stopDiscovery();
  }

  /**
  * Establishes a connection with the given host.
  * @param {string} hostAddress the address to connect to.
  */
  public join(hostAddress: string) {
    this.commsManager.connect(hostAddress);
  }

  /**
  * Disconnects from the current network and resets the peers list.
  */
  public leave() {
    this.commsManager.disconnect();
    this.peers = new Array<string>();
  }

  /**
  * Sends a given message string to some number of peers.
  * @param {string[]} addresses the list of peers to receive this message.
  * @param {string} message the message to send
  */
  public send(addresses: string[], message: string) {
    this.commsManager.send(addresses, message);
  }

  /**
  * This method handles all payloads that come across the network.
  * @param {string} message this is a json string representing a P2PMessage object
  */
  public receive(message: string) {
    console.log('WTFISHAPPENING: ' + JSON.stringify(message));
    console.log('Received message: ' + message);
    let payload = JSON.parse(message);
    let payloadType: MessageTypes = (<any>MessageTypes)[payload.type];

    switch(payloadType) {
      //A new endpoint is joining the network
      case MessageTypes.JOIN:
        console.log("Adding peer " + payload.source + " to network.");
        this.addPeer(payload.source);
        break;
      //This message is an update sent when peers leave or join a network
      case MessageTypes.LEAVE:
        console.log("Removing peer " + payload.source + " from network.");
        this.removePeer(payload.source);
        break;
      //This type is for a chat message
      case MessageTypes.MESSAGE:
        console.log("Recieved network message from peer " + payload.source + ": " + payload.message);
        this.events.publish('network-message', { source: payload.source, message: payload.message });
        break;
      //A new endpoint has been discovered
      case MessageTypes.DISCOVERED:
        console.log("New network discovered at endpoint: " + payload.source + " broadcasting: " + payload.message);
        this.events.publish('network-discovered', { broadcast: payload.message, source: payload.source });
        break;
      //A previously disccovered endpoint has been lost
      case MessageTypes.BROADCAST:
        console.log("Lost previously discovered network " + payload.source);
        this.events.publish('network-lost', { source: payload.source });
        break;
    }
  }

  /**
  * Broadcasts a new message to listeners on the network.
  * TODO: There is a strict length limit, so we need a way to handle that
  * @param {string} message the message to be broadcast
  */
  public advertise(message: string) {
    this.commsManager.advertise(message);
  }

  /**
  * Stops broadcasting the current message
  */
  public stopAdvertising() {
    this.commsManager.stopAdvertising();
  }

  /**
  * Adds a new peer to the network and sets up a connection. It also propagates this
  * peer to everyone else on the network.
  * @param {string} address the new peer's address
  */
  public addPeer(address: string) {
    if (!this.peers.includes(address)) {
      this.commsManager.connect(address);
      this.peers.push(address);
      this.sendRoutingTableUpdate(address);

      this.events.publish('peer-joined', {address: address});
    }
  }

  /**
  * Removes a peer from the list. The connection has already been lost on the comms layer, so we
  * just need to remove the reference to the peer.
  * @param {string} address the peer to remove
  */
  public removePeer(address: string) {
    if (this.peers.includes(address)) {
      this.peers.splice(this.peers.indexOf(address), 1);

      this.events.publish('peer-left', {address: address});
    }
  }

  /**
  * When a new peer joins the network, update other peers and let them know they need to request
  * connections.
  * @param {string} address the new peer's endpoint address
  */
  public sendRoutingTableUpdate(address: string) {
    this.commsManager.send(this.peers, P2PMessageFactory.createJoinJson(address, null));
  }
}
