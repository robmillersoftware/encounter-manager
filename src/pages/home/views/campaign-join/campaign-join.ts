import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { ConnectionService } from '@shared/services';
import { BroadcastTypes } from '@globals';

@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
  //public peers: String[];
  public services: any;
  constructor(public connection: ConnectionService) {
    /*this.connection.subscribeToPeers(peers => {
      this.peers = peers;
    });*/

    this.connection.subscribeToServices(services => {
      console.log("GETTING SERVICES: " + services);
      this.services = services;
    });

    this.connection.broadcastService("LET'S DO THIS", BroadcastTypes.JOINING);
  }

  getTitle() {
    return "Join a Campaign";
  }
}
