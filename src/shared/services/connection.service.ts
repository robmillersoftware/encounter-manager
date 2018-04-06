import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CampaignFactory, Campaign, MessageFactory, Player, PlayerFactory } from '@shared/objects';
import { UserService } from '@shared/services';
import { Globals, debugMap, parseIdentifier } from '@globals';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ConnectionService {
  private isIos: boolean;
  private isCordova: boolean;

  public localCampaigns: BehaviorSubject<Map<string, Campaign>>;
  public campaignPlayers: BehaviorSubject<Map<string, string>>;

  constructor(private platform: Platform, private userService: UserService) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");
    this.localCampaigns = new BehaviorSubject(null);
    this.campaignPlayers = new BehaviorSubject(null);

    if (this.isCordova && window["NearbyPlugin"]) {
      this.setIdentifier();
      window["NearbyPlugin"].setServiceId(Globals.serviceId);
    }

    console.log("Connection Service initialized. IsCordova? " + this.isCordova);
  }

  private async setIdentifier() {
    window["NearbyPlugin"].setIdentifier(await this.userService.getIdentifier());
  }

  public advertiseCampaign(c: Campaign) {
    if (this.isCordova && window["NearbyPlugin"]) {
      console.log("Advertising campaign has been called. With campaign: "
        + CampaignFactory.toBroadcast(c));

      window["NearbyPlugin"].startAdvertising(CampaignFactory.toBroadcast(c), connection => {
        console.log("GOT CONNECTION STUFFS: " + JSON.stringify(connection));
        console.log(connection);
      });
    }
  }

  public discoverCampaigns() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].startDiscovery(campaigns => {
        let messages = MessageFactory.fromJSON(campaigns);
        let messagesObj = JSON.parse(messages.msg);
        let campaignMap: Map<string, Campaign> = this.localCampaigns.getValue();

        if (campaignMap === null) {
          campaignMap = new Map<string, Campaign>();
        }

        Object.keys(messagesObj).forEach(key => {
          campaignMap.set(messages.src, CampaignFactory.fromBroadcast(messagesObj[key]));
        });

        this.localCampaigns.next(campaignMap);
      });
    }
  }

  public async connectToCampaign(name: string) {
    let map: Map<string, Campaign> = this.localCampaigns.value;

    if (!map) {
      console.log("No value has been assigned to localCampaigns");
      return;
    }

    Array.from(map.keys()).forEach(key => {
      let c: Campaign = map.get(key);
      if (c.name === name) {
        window["NearbyPlugin"].connectToCampaign(parseIdentifier(key).endpoint);
      }
    });
  }

  public stopDiscovery() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].stopDiscovery();
    }
  }

  public stopAdvertising() {
    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].stopAdvertising();
    }
  }
}
