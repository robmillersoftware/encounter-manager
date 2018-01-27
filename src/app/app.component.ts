import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;

  rootPage: any;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      this.rootPage = TabsPage;
    });
  }
}

