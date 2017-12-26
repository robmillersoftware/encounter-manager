import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OptionsPage } from '../pages/options/options';
import { CampaignPage } from '../pages/campaign/campaign';

//Custom Components
import { EncNavbar } from '../components/encNav/encNav';
import { EncTile } from '../components/encTile/encTile';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OptionsPage,
    CampaignPage,
    EncNavbar,
    EncTile
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OptionsPage,
    CampaignPage,
    EncNavbar,
    EncTile
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
