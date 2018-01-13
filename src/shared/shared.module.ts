/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { EncNavbar } from './components/encNav/encNav';
import { EncTile } from './components/encTile/encTile';

@NgModule({
    imports: [IonicModule],
    bootstrap: [IonicApp],
    declarations: [EncNavbar, EncTile],
    entryComponents: [EncNavbar, EncTile],
    exports: [EncNavbar, EncTile, IonicModule]
})
export class SharedModule {}