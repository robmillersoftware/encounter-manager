import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '@pages/tabs/tabs.component';
import { UserService } from '@shared/services';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
      userService: UserService) {
    if (platform.is('cordova')) {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        console.log("Platform is ready. User profile is loaded");
        statusBar.styleDefault();
        splashScreen.hide();
      });
    }
  }
}
