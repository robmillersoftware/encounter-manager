import { Component, Input } from '@angular/core';
import { HomeViewComponent } from '../home-view.component';

@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  ionViewDidLoad() {
    
    
  }

  getTitle() {
    return "Join a Campaign";
  }
}

