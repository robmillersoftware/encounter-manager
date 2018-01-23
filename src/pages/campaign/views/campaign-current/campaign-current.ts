import { Component, Input } from '@angular/core';
import { CampaignViewComponent } from '../campaign-view.component';

@Component({
  templateUrl: './campaign-current.html'
})
export class CampaignCurrent implements CampaignViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;
}

