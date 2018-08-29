/**
 * The module for the P2P network manager
 */
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NetworkingService } from '@networking';
import { CommsManager } from '@networking/comms';
import { P2PNetworkManager } from '@networking/p2p';

@NgModule({
  imports: [IonicModule],
  providers: [CommsManager, P2PNetworkManager, NetworkingService]
})
export class NetworkingModule {}
