import { Component, Input } from '@angular/core';
import { CampaignViewComponent } from '../campaign-view.component';

@Component({
  templateUrl: './campaign-load.html'
})
export class CampaignLoad implements CampaignViewComponent {
  @Input() data: any;
  @Input() name: string;
}

