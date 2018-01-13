/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';

import { CampaignPage } from './campaign.component';
import { CampaignDirective } from './campaign.directive';
import { CampaignService } from './campaign.service';

import { CampaignNew } from './views/campaign-new/campaign-new';
import { CampaignJoin } from './views/campaign-join/campaign-join';
import { CampaignLoad } from './views/campaign-load/campaign-load';
import { CampaignCurrent } from './views/campaign-current/campaign-current';

@NgModule({
    imports: [SharedModule, IonicPageModule.forChild(CampaignPage)],
    declarations: [
        CampaignPage, 
        CampaignNew, 
        CampaignJoin, 
        CampaignLoad, 
        CampaignCurrent,
        CampaignDirective
    ],
    entryComponents: [
        CampaignPage,
        CampaignNew, 
        CampaignJoin, 
        CampaignLoad, 
        CampaignCurrent
    ],
    providers: [CampaignService],
    exports: [
        CampaignPage
    ]
})
export class CampaignModule {}