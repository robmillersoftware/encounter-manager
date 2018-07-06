/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicApp } from 'ionic-angular';

import { EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal,
  MessageBubble, MessageInput } from '@shared/components';

import { StorageService, CharacterStorage, LocationService, UserStorage, CampaignStorage, ChatStorage } from '@shared/persistence';
import { ConnectionService, NavigationService, CharacterService, CampaignService, ChatService } from '@shared/services';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, MessageBubble, MessageInput],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, MessageBubble, MessageInput],
    providers: [
      StorageService,
      LocationService,
      CharacterStorage,
      UserStorage,
      CampaignStorage,
      ChatStorage,
      CharacterService,
      NavigationService,
      CampaignService,
      ChatService,
      ConnectionService
    ],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, MessageBubble, MessageInput, IonicModule],
})
export class SharedModule {}
