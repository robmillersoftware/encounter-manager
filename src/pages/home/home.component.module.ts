/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';

import { HomePage } from './home.component';
import { CharacterList } from './views/character-list/character-list';
import { CharacterNew } from './views/character-new/character-new';
import { LocationList } from './views/location-list/location-list';
import { LocationNew } from './views/location-new/location-new';
import { CampaignNew } from './views/campaign-new/campaign-new';
import { CampaignLoad } from './views/campaign-load/campaign-load';
import { CampaignJoin } from './views/campaign-join/campaign-join';
import { Dashboard } from './views/dashboard/dashboard';

import { HomeService } from './home.service';
import { HomeDirective } from './home.directive';

@NgModule({
    imports: [SharedModule, IonicPageModule.forChild(HomePage)],
    declarations: [
        HomePage, 
        CampaignNew, CampaignLoad, CampaignJoin,
        CharacterList, CharacterNew, 
        LocationList, LocationNew, 
        Dashboard, 
        HomeDirective],
    entryComponents: [
        HomePage, 
        CampaignNew, CampaignLoad, CampaignJoin,
        CharacterList, CharacterNew, 
        LocationList, LocationNew, 
        Dashboard],
    providers: [HomeService],
    exports: [HomePage]
})
export class HomeModule {}