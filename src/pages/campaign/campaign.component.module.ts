import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';

import { CampaignPage } from './campaign.component';
import { StartEncounterModal } from './modals/start-encounter/start-encounter.component';
import { AddLocationModal } from './modals/add-location/add-location.component';
import { AddCharacterModal } from './modals/add-character/add-character.component';

@NgModule({
    imports: [
        SharedModule, 
        IonicPageModule.forChild(CampaignPage), 
        IonicModule.forRoot(AddCharacterModal),
        IonicModule.forRoot(AddLocationModal),
        IonicModule.forRoot(StartEncounterModal)
    ],
    declarations: [
        CampaignPage, StartEncounterModal, AddLocationModal, AddCharacterModal],
    entryComponents: [
        CampaignPage, StartEncounterModal, AddLocationModal, AddCharacterModal],
    exports: [CampaignPage]
})
export class CampaignModule {}