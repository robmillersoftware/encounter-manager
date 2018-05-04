import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CampaignFactory, Campaign, PayloadFactory, Payload } from '@shared/objects';
import { UserService } from '@shared/services';
import { Globals, parseIdentifier } from '@globals';
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

  //Gets updated whenever new campaigns are discovered with Nearby. The key is an
  //identifier
  public remoteCampaigns: BehaviorSubject<Map<string, Campaign>>;

  //Gets updated when information about players on the same campaign as you is found
  public connections: BehaviorSubject<Array<string>>;

  constructor(private platform: Platform, private userService: UserService) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");
    this.remoteCampaigns = new BehaviorSubject(null);
    this.connections = new BehaviorSubject(null);

    this.platform.ready().then(() => {
      if (this.isCordova && window["NearbyPlugin"]) {
        //Listen for updates to the user and change the registered identifier as appropriate
        this.userService.userSubject.subscribe((u) => {
          if (u) {
            window["NearbyPlugin"].setIdentifier(this.userService.getIdentifier());
          }
        });

        window["NearbyPlugin"].setServiceId(Globals.serviceId);
      }
    });

    console.log("Connection Service initialized.");
  }

  /**
  * Advertises a campaign using the NearbyPlugin. In order to ensure we are under
  * the maximum bytes, the campaign is condensed into a broadcast JSON string
  * @param c the campaign to advertise
  */
  public async advertiseCampaign(c: Campaign) {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].startAdvertising(CampaignFactory.toBroadcast(c), connection => {
        //This method is called when a connection is established
        let connArr = this.connections.value;
        connArr.push(JSON.stringify(connection));
        this.connections.next(connArr);
      });
    }
  }

  /**
  * Discover nearby campaigns using the Nearby plugin. It listens for advertisements
  * specifically broadcasting a campaign object
  */
  public async discoverCampaigns() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].startDiscovery(discovered => {
        //data should be a JSON string matching a Payload object
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
  public async connectToCampaign(name: string, callback: any) {
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
      window["NearbyPlugin"].stopAdvertising();
    }
  }
}
