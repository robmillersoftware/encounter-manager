import { setServiceInjector } from '@globals';
import { NgModule, ErrorHandler, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SharedModule } from '@shared/shared.module';
import { HomeModule } from '@pages/home/home.component.module';
import { CampaignModule } from '@pages/campaign/campaign.component.module';
import { ChatModule } from '@pages/chat/chat.component.module';
import { OptionsModule } from '@pages/options/options.component.module';

import { EncounterPage, NotesPage, TabsPage, MainPage } from '@pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    EncounterPage,
    NotesPage,
    TabsPage,
    MainPage
  ],
  imports: [
    SharedModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HomeModule,
    CampaignModule,
    ChatModule,
    OptionsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EncounterPage,
    NotesPage,
    TabsPage,
    MainPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  constructor(injector: Injector) {
    setServiceInjector(injector);
  }
}
