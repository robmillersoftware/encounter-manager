import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CampaignFactory, Campaign, PayloadFactory, Payload } from '@shared/objects';
import { UserService, StorageService } from '@shared/services';
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
  public campaignPlayers: BehaviorSubject<Map<string, string>>;

  constructor(private platform: Platform, private userService: UserService,
      private storageService: StorageService) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");
    this.remoteCampaigns = new BehaviorSubject(null);
    this.campaignPlayers = new BehaviorSubject(null);

    if (this.isCordova && window["NearbyPlugin"]) {
      //The identifier for this user and the service id for the app should be set
      //before calling any NearbyPlugin methods
      this.setIdentifier();
      window["NearbyPlugin"].setServiceId(Globals.serviceId);
    }

    console.log("Connection Service initialized.");
  }

  /**
  * Sets the identifier on the Nearby plugin. It is a JSON object that is attached
  * to every message sent from or received by this application
  */
  private async setIdentifier() {
    window["NearbyPlugin"].setIdentifier(await this.userService.getIdentifier());
  }

  /**
  * Advertises a campaign using the NearbyPlugin. In order to ensure we are under
  * the maximum bytes, the campaign is condensed into a broadcast JSON string
  * @param c the campaign to advertise
  */
  public advertiseCampaign(c: Campaign) {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].startAdvertising(CampaignFactory.toBroadcast(c), connection => {
        //This method is called when a connection is established
        console.log("GOT CONNECTION STUFFS: " + JSON.stringify(connection));
        console.log(connection);
      });
    }
  }

  /**
  * Get a map of remote campaigns with key of endpoint id and value of campaign object
  * @return Map<string, Campaign>
  */
  private async getRemoteCampaigns() {
    return await this.storageService.get('remoteCampaigns');
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
          let identifier = parseIdentifier(data.src);
          campaigns.set(identifier.endpoint, CampaignFactory.fromBroadcast(data.payload));
          this.remoteCampaigns.next(data.payload);
        }
      });
    }
  }

  /**
  * Connects to a remote campaign with the specified name
  * @param name
  */
  public async connectToCampaign(name: string) {
    let map: Map<string, Campaign> = this.remoteCampaigns.value;

    if (!map) {
      console.log("No value has been assigned to remoteCampaigns");
      return;
    }

    Array.from(map.keys()).forEach(key => {
      let c: Campaign = map.get(key);
      if (c.name === name) {
        window["NearbyPlugin"].connectToCampaign(parseIdentifier(key).endpoint);
      }
    });
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
