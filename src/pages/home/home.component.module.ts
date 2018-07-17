/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '@shared/shared.module';

import { HomePage } from './home.component';
import { CharacterEdit, CharacterNew, LocationEdit,
    LocationNew, Dashboard, CampaignNew, CampaignJoin, CampaignLoad } from './views';

import { HomeService } from './home.service';
import { HomeDirective } from './home.directive';

@NgModule({
    imports: [SharedModule, IonicPageModule.forChild(HomePage)],
    declarations: [
        HomePage,
        CampaignNew, CampaignLoad, CampaignJoin,
        CharacterEdit, CharacterNew,
        LocationEdit, LocationNew,
        Dashboard,
        HomeDirective],
    entryComponents: [
        HomePage,
        CampaignNew, CampaignLoad, CampaignJoin,
        CharacterEdit, CharacterNew,
        LocationEdit, LocationNew,
        Dashboard],
    providers: [HomeService],
    /*exports: [HomePage]*/
})
export class HomeModule {}
