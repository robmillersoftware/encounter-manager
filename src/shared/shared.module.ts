/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicApp } from 'ionic-angular';

import { NetworkingModule } from '@networking';

import { EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal,
  MessageBubble, MessageInput, AppSettingsModal } from '@shared/components';

import { StorageService, CharacterStorage, LocationStorage, UserStorage, CampaignStorage, ChatStorage, GameStorage } from '@shared/persistence';
import { LocationService, NavigationService, CharacterService, CampaignService, ChatService, GameService, UserService } from '@shared/services';

@NgModule({
    imports: [NetworkingModule, IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, AppSettingsModal, MessageBubble, MessageInput],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, AppSettingsModal, MessageBubble, MessageInput],
    providers: [
      StorageService,
      CharacterStorage,
      UserStorage,
      CampaignStorage,
      ChatStorage,
      GameStorage,
      LocationStorage,
      LocationService,
      CharacterService,
      NavigationService,
      CampaignService,
      ChatService,
      GameService,
      UserService
    ],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, AccountSettingsModal, AppSettingsModal, MessageBubble, MessageInput, IonicModule],
})
export class SharedModule {}
