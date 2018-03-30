/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicApp } from 'ionic-angular';

import { EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard }
  from '@shared/components';

import { StorageService, CharacterService, LocationService, UserService,
    ConnectionService, CampaignService } from '@shared/services';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    providers: [StorageService, LocationService, CharacterService, UserService, ConnectionService, CampaignService],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, IonicModule],
})
export class SharedModule {}
