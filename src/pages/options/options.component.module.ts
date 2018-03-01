/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { OptionsPage } from '@pages';

@NgModule({
    imports: [SharedModule],
    declarations: [OptionsPage],
    entryComponents: [OptionsPage],
})
export class OptionsModule {}