import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MainPage } from '@pages';
import { NavigationService } from '@shared/services';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = MainPage;
  headerData: any;

  constructor(zone: NgZone, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
      navService: NavigationService) {

    navService.headerData.subscribe((data) => {
      this.headerData = data;
    });

    if (platform.is('cordova')) {
      platform.ready().then(() => {
        console.log("Platform ready cordova")
        statusBar.styleDefault();
        splashScreen.hide();
      });
    }
  }
}
