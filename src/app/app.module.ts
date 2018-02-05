import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../pages/home/home.component.module';
import { CampaignModule } from '../pages/campaign/campaign.component.module';
import { OptionsModule } from '../pages/options/options.component.module';

import { EncounterPage } from '../pages/encounter/encounter.component';
import { NotesPage } from '../pages/notes/notes.component';
import { TabsPage } from '../pages/tabs/tabs.component';
import { ChatPage } from '../pages/chat/chat.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp, 
    EncounterPage, 
    NotesPage, 
    ChatPage, 
    TabsPage
  ],
  imports: [
    SharedModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HomeModule,
    CampaignModule,
    OptionsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    EncounterPage, 
    NotesPage, 
    ChatPage, 
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
