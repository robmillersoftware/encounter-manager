/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';

import { EncNavbar } from './components/enc-nav/enc-nav';
import { EncTile } from './components/enc-tile/enc-tile';

import { StorageService } from './services/storage.service';

@NgModule({
    imports: [IonicModule, IonicStorageModule.forRoot()],
    bootstrap: [IonicApp],
    declarations: [EncNavbar, EncTile],
    entryComponents: [EncNavbar, EncTile],
    providers: [StorageService],
    exports: [EncNavbar, EncTile, IonicModule, IonicStorageModule],
})
export class SharedModule {}