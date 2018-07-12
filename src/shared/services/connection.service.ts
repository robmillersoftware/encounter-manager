import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CampaignFactory, Campaign, Player,
  PayloadFactory, Payload, Message } from '@shared/objects';
import { UserStorage } from '@shared/persistence';
import { Globals, parseIdentifier, generateIdentifier } from '@globals';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
* This service handles connections between peer devices
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class ConnectionService {
  private isIos: boolean;
  private isCordova: boolean;
  private isAdvertising: boolean = false;

  //Gets updated whenever new campaigns are discovered with Nearby. The key is an
  //identifier JSON object
  public remoteCampaigns: BehaviorSubject<Map<string, Campaign>>;

  //Gets updated when information about players on the same campaign as you is found
  //TODO: evaluate the necessity of this variable
  public connections: BehaviorSubject<Array<string>>;

  constructor(public platform: Platform, public userStorage: UserStorage) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");

    this.remoteCampaigns = new BehaviorSubject(null);
    this.connections = new BehaviorSubject(null);

    this.platform.ready().then(() => {
      if (this.isCordova && window["NearbyPlugin"]) {
        //Listen for updates to the user and change the registered identifier as appropriate
        this.userStorage.userSubject.subscribe((u) => {
          if (u) {
            window["NearbyPlugin"].setIdentifier(this.userStorage.getIdentifier());
          }
        });

        //The service ID is the same for all devices running this app and should only change
        //between versions
        window["NearbyPlugin"].setServiceId(Globals.serviceId);
      }
    });

    console.log("Connection Service initialized.");
  }

  /**
  * Registers a callback to handle any messages coming through the Nearby plugin
  * @param callback a function that takes a JSON object as a parameter
  */
  public registerMessageHandler(callback: any) {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].setMessageHandler(callback);
    }
  }

  /**
  * Advertises a campaign using the NearbyPlugin. In order to ensure we are under
  * the maximum bytes, the campaign is condensed into a broadcast JSON string
  * @param c the campaign to advertise
  */
  public advertiseCampaign(c: Campaign, newPlayerCallback: any) {
    if (this.isCordova && window["NearbyPlugin"]) {
      if (this.isAdvertising) {
        this.stopAdvertising();

        //If null is passed in, then just stop advertising and return
        if (!c) {
          console.log("Null value passed to advertiseCampaign.")
          return;
        }
      }

      window["NearbyPlugin"].startAdvertising(CampaignFactory.toBroadcast(c), connection => {
        //This method is called when a connection is established
        //TODO: this section might be deleted during the evaluation of the connections object
        let connArr = this.connections.value;
        connArr.push(JSON.stringify(connection));
        this.connections.next(connArr);

        newPlayerCallback(connection);
      });

      this.isAdvertising = true;
    }
  }

  /**
  * Discover nearby campaigns using the Nearby plugin. It listens for advertisements
  * specifically broadcasting a campaign object
  */
  public discoverCampaigns() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].startDiscovery(discovered => {
        //data should be a JSON string matching a Payload object
        //TODO: Improve error handling here and evaluate the payload object paradigm
        let data: Payload = PayloadFactory.fromJSON(discovered);

        if (!data) {
          console.error("Improperly formatted payload sent by NearbyPlugin: "
            + discovered);
          return;
        }

        if (data.payload) {
          let campaigns: Map<string, Campaign> = this.remoteCampaigns.value;

          if (!campaigns) {
            campaigns = new Map<string, Campaign>();
          }

          //Add the discovered campaign to the list of remote campaigns
          let identifier = parseIdentifier(data.src);
          campaigns.set(identifier.endpoint, data.payload);
          this.remoteCampaigns.next(campaigns);
        }
      });
    }
  }

  /**
  * Connects to a remote campaign with the specified name
  * @param name
  */
  public connectToCampaign(name: string, callback: any) {
    if (this.isCordova && window["NearbyPlugin"]) {
      let map: Map<string, Campaign> = this.remoteCampaigns.value;
      if (!map) {
        console.log("No value has been assigned to remoteCampaigns");
        return;
      }

      Array.from(map.keys()).forEach(key => {
        let c: Campaign = map.get(key);
        if (c.name === name) {
          window["NearbyPlugin"].connectToCampaign(key, result => {
            if (!this.connections.value) {
              this.connections.next(new Array<string>());
            }

            //TODO: This smells fishy. Include this in the evaluation of the connections object
            let connArr = this.connections.value;
            connArr.push(JSON.stringify(result));
            this.connections.next(connArr);

            callback(true);
          });
        }
      });
    }
  }

  /**
  * Stop the Nearby plugin from looking for campaigns
  */
  public stopDiscovery() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].stopDiscovery();
    }
  }

  /**
  * Stop advertising the current campaign
  */
  public stopAdvertising() {
    if (this.isCordova && window["NearbyPlugin"]) {
      console.log("Stopping advertising");
      window["NearbyPlugin"].stopAdvertising();
      this.isAdvertising = false;
    }
  }

  /**
  * Add a new message to a conversation
  *
  * @param message A message object containing what was sent
  * @param players a list of players to send it to
  */
  public sendMessage(message: Message, players: Array<Player>) {
    if (this.isCordova && window["NearbyPlugin"]) {
      for (let player of players) {
        let identifier = generateIdentifier(player.name, player.id, player.endpoint);
        let payload: Payload = PayloadFactory.createMessage(message, this.userStorage.getIdentifier(), identifier);
        window["NearbyPlugin"].sendBytes(player.endpoint, payload);
      }
    }
  }
}
