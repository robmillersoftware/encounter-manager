/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';

import { EncTile } from './components/enc-tile/enc-tile';
import { EncChat } from './components/enc-chat/enc-chat';
import { EncPlayerCard } from './components/enc-player-card/enc-player-card.component';
import { EncNpcCard } from './components/enc-npc-card/enc-npc-card.component';
import { EncCampaignCard } from './components/enc-campaign-card/enc-campaign-card.component';
import { EncLocCard } from './components/enc-loc-card/enc-loc-card.component';

import { StorageService, CampaignService, CharacterService, 
    LocationService, UserService, BluetoothService } from './services';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    entryComponents: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard],
    providers: [StorageService, CampaignService, LocationService, CharacterService, UserService, BluetoothService],
    exports: [EncTile, EncChat, EncPlayerCard, EncNpcCard, EncCampaignCard, EncLocCard, IonicModule, IonicStorageModule],
})
export class SharedModule {}