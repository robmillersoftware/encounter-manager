/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { HomePage } from './home.component';

@NgModule({
    imports: [SharedModule],
    declarations: [HomePage],
    entryComponents: [HomePage],
})
export class HomeModule {}