/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicApp } from 'ionic-angular';

import { EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal }
  from '@shared/components';

import { StorageService, CharacterService, LocationService, UserService,
    ConnectionService, CampaignService, NavigationService } from '@shared/services';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal],
    providers: [
      StorageService,
      LocationService,
      CharacterService,
      UserService,
      ConnectionService,
      CampaignService,
      NavigationService
    ],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, IonicModule],
})
export class SharedModule {}
