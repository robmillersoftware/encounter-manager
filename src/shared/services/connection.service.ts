import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CampaignFactory, Campaign } from '@shared/objects';
import { UserService } from '@shared/services';
import { Globals } from '@globals';

@Injectable()
export class ConnectionService {
  private isIos: boolean;
  private isCordova: boolean;

  constructor(private platform: Platform, private userService: UserService) {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");

    if (this.isCordova && window["NearbyPlugin"]) {
      window["NearbyPlugin"].setToken(Globals.connectionToken);
      this.setIdentifier();
    }

    console.log("Connection Service initialized. IsCordova? " + this.isCordova);
  }

  private async setIdentifier() {
    let identifier = {
      name: await this.userService.getName(),
      id: await this.userService.getId()
    };

    window["NearbyPlugin"].setIdentifier(JSON.stringify(identifier));
  }

  public advertiseCampaign(c: Campaign) {
    if (this.isCordova && window["NearbyPlugin"]) {
      console.log("Advertising campaign has been called. With campaign: "
        + CampaignFactory.toBroadcast(c));
      window["NearbyPlugin"].startAdvertising(CampaignFactory.toBroadcast(c), Globals.serviceId);
    }
  }

  public discoverCampaigns(userName: string, callback: any) {
    if (this.isCordova && window["NearbyPlugin"]) {
      console.log("Discovering campaigns.");
      window["NearbyPlugin"].startDiscovery({user: userName, token: Globals.connectionToken }, Globals.serviceId, callback);
    }
  }

  /*public subscribeToBroadcasts(cb) {
    if (!this.broadcastSubject) {
      this.broadcastSubject = new BehaviorSubject<Array<Object>>([]);

      if (this.isCordova && window["WifiDirect"]) {
        console.log("Subscribing to broadcasts")
        window["WifiDirect"].subscribeToBroadcasts(broadcast => {
          let dataObjects: Array<Object> = Object.keys(broadcast).map(v => {
            return JSON.parse(broadcast[v].data);
          });

          console.log("Received broadcast messages:\n" + dataObjects.map(v => {
            return JSON.stringify(v);
          }).join('\n'));

          this.broadcastSubject.next(dataObjects);
        });
      }
      this.broadcastSubject.subscribe(cb);
    }
  }

  public broadcastMessage(msg: string, state: string = '') {
    let broadcast = {
      type: BroadcastTypes.MESSAGE,
      shouldRemove: true,
      message: msg
    }

    console.log("Broadcasting: " + JSON.stringify(broadcast));

    if (this.isCordova) {
      window["WifiDirect"].broadcast(JSON.stringify(broadcast), state);
    }
  }

  public broadcastCampaign(campaign: Campaign, state: string = '') {
    let broadcast = {
      type: BroadcastTypes.CAMPAIGN,
      shouldRemove: true,
      campaign: CampaignFactory.toBroadcast(campaign)
    }

    if (this.isCordova) {
      window["WifiDirect"].broadcast(JSON.stringify(broadcast), state);
    }
  }

  public createGroup(callback: any) {
    if (this.isCordova) {
      window["WifiDirect"].createGroup(callback);
    }
  }

  public joinCampaign(campaign: Campaign, callback: any) {
    if (this.isCordova) {
      window["WifiDirect"].joinGroup(campaign.gm.device, obj => {
        console.log("AYY JOINING: " + JSON.stringify(obj));
        callback(false);
      });
    }
  }*/
}
