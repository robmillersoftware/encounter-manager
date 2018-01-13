import { Component, Input } from '@angular/core';
import { CampaignViewComponent } from '../campaign-view.component';

@Component({
  templateUrl: './campaign-new.html'
})
export class CampaignNew implements CampaignViewComponent {
  @Input() data: any;
  @Input() name: string;
}

