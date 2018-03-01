/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';

import { EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard } from '@shared/components';

import { StorageService, CampaignService, CharacterService,
    LocationService, UserService, ConnectionService } from '@shared/services';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    providers: [StorageService, CampaignService, LocationService, CharacterService, UserService, ConnectionService],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, IonicModule, IonicStorageModule],
})
export class SharedModule {}