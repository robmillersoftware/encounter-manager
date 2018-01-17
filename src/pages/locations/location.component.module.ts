/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';

import { LocationPage } from './location.component';
import { LocationDirective } from './location.directive';
import { LocationService } from './location.service';

import { LocationList } from './views/location-list/location-list';
import { LocationNew } from './views/location-new/location-new';

@NgModule({
    imports: [SharedModule,IonicPageModule.forChild(LocationPage)],
    declarations: [
        LocationPage, 
        LocationList, 
        LocationNew,
        LocationDirective
    ],
    entryComponents: [
        LocationPage,
        LocationList,
        LocationNew
    ],
    providers: [LocationService],
    exports: [
        LocationPage
    ]
})
export class LocationModule {}