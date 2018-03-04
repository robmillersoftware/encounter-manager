import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { ConnectionService } from '@shared/services';

@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  constructor(public connection: ConnectionService) {}

  ionViewDidLoad() {
  }

  getTitle() {
    return "Join a Campaign";
  }
}

