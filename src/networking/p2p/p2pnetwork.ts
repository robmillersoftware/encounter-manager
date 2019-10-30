import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { P2PMessageFactory, P2PTypes } from '@networking/p2p';
import { CommsManager } from '@networking/comms';

@Injectable()
export class P2PNetworkManager {
  private peers: Array<string>;

  constructor(private commsManager: CommsManager, private events: Events) {
    this.peers = new Array<string>();
    console.log("Setting receive handlers in P2P Network");

    this.commsManager.setDiscoveryCallback(this.receiveEndpoints.bind(this));
    this.commsManager.setPayloadCallback(this.receivePayload.bind(this));
    this.commsManager.setConnectionCallback(this.receiveConnections.bind(this));
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
  public join(hostAddress: string, message: string) {
    this.peers.push(hostAddress);
    this.commsManager.connect(hostAddress, message);
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

  public receiveConnections(event: any) {
    let payload = P2PMessageFactory.fromJSON(event.detail);

    switch(payload.type) {
      //A new endpoint is joining the network
      case P2PTypes.JOIN:
        console.log("Adding peer " + payload.source + " to network.");
        this.addPeer(payload.source);
        break;
      //This message is an update sent when peers leave or join a network
      case P2PTypes.LEAVE:
        console.log("Removing peer " + payload.source + " from network.");
        this.removePeer(payload.source);
        break;
      case P2PTypes.CONNECTED:
        console.log("Successfully connected to endpoint: " + payload.source);
        this.events.publish('network-connected', { source: payload.source });
        break;
      default:
        console.log("Received unknown payload type from connection lifecycle endpoint: " + payload.type);
    }
  }

  public receiveEndpoints(event: any) {
    console.log(event);
    console.log(JSON.stringify(event));
    let payload = P2PMessageFactory.fromJSON(event.detail);

    switch(payload.type) {
      case P2PTypes.DISCOVERED:
        console.log("New network discovered at endpoint: " + payload.source + " broadcasting: " + payload.message);
        this.events.publish('network-discovered', { broadcast: payload.message, source: payload.source });
        break;
      //A previously disccovered endpoint has been lost
      case P2PTypes.BROADCAST:
        console.log("Lost previously discovered network " + payload.source);
        this.events.publish('network-lost', { source: payload.source });
        break;
      default:
        console.log("Received unknown payload type from discovery endpoint: " + payload.type);
    }
  }

  /**
  * This method handles all payloads that come across the network.
  * @param {string} message this is a json string representing a P2PMessage object
  */
  public receivePayload(event: any) {
    let payload = P2PMessageFactory.fromJSON(event.detail);

    switch(payload.type) {
      //This type is for a chat message
      case P2PTypes.MESSAGE:
        console.log("Recieved network message from peer " + payload.source + ": " + payload.message);
        this.events.publish('network-message', { source: payload.source, message: payload.message });
        break;
      case P2PTypes.SYNC:
        console.log("Received sync");
        this.events.publish('network-sync', { source: payload.source, object: payload.message });
        break;
      default:
        console.log("Received unknown payload type from payload endpoint: " + payload.type);
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
      this.commsManager.send(this.peers, P2PMessageFactory.createJoinJson(address));
      this.peers.push(address);
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

      this.events.publish('peer-left', {source: address});
    }
  }

  public sync(message: string) {
    if (this.peers.length > 0) {
      this.commsManager.send(this.peers, P2PMessageFactory.createSyncJson(message));
    }
  }
}
