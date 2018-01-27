import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';
import { Globals } from '../../../../globals';

@Component({
  templateUrl: './dashboard.html'
})
export class Dashboard implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public campaignTiles: Array<Object> = Globals.campaignTiles;
  public characterTiles: Array<Object> = Globals.characterTiles;
  public locationTiles: Array<Object> = Globals.locationTiles;

  constructor() {}

  getTitle() {
    return "Encounter Manager";
  }

  navTo(data: any) {
    if (data.changeTab) {
      this.callback('tabChange', data.tabName);
    } else {
      this.callback('pageChange', data.page + '-' + data.state);
    }
  }
}

