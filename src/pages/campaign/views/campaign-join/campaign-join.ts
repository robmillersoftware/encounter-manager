import { Component, Input } from '@angular/core';
import { CampaignViewComponent } from '../campaign-view.component';

@Component({
  templateUrl: './campaign-join.html'
})
export class CampaignJoin implements CampaignViewComponent {
  @Input() data: any;
  @Input() name: string;
}

