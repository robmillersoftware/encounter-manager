/**
 * Shared module for objects used by multiple other modules
 */
import { NgModule } from '@angular/core';
import { IonicModule, IonicApp } from 'ionic-angular';

import { TestingControlsModal, NetworkTestingPanel, ControlsAccordion } from '@test/components';

@NgModule({
    imports: [IonicModule],
    bootstrap: [IonicApp],
    declarations: [TestingControlsModal, NetworkTestingPanel, ControlsAccordion],
    entryComponents: [TestingControlsModal, NetworkTestingPanel, ControlsAccordion],
    exports: [TestingControlsModal, IonicModule]
})
export class TestModule {}
