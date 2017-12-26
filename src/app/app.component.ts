import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CampaignPage } from '../pages/campaign/campaign';
import { OptionsPage } from '../pages/options/options';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  homePage:any;
  campaignPage:any;
  optionsPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.homePage = HomePage;
      this.campaignPage = CampaignPage;
      this.optionsPage = OptionsPage;

      this.rootPage = HomePage;
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    this.rootPage = page;
  }
}

