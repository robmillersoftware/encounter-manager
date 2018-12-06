/**
 * The module for the P2P network manager
 */
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NetworkingService, SyncService } from '@networking';
import { CommsManager } from '@networking/comms';
import { P2PNetworkManager } from '@networking/p2p';
import { Broadcaster } from '@ionic-native/broadcaster';

@NgModule({
  imports: [IonicModule],
  providers: [CommsManager, P2PNetworkManager, NetworkingService, SyncService, Broadcaster]
})
export class NetworkingModule {}
