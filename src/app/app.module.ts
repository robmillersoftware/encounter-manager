import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../pages/home/home.component.module';
import { OptionsModule } from '../pages/options/options.component.module';

import { EncounterPage } from '../pages/encounter/encounter.component';
import { NotesPage } from '../pages/notes/notes.component';
import { TabsPage } from '../pages/tabs/tabs.component';
import { CampaignPage } from '../pages/campaign/campaign.component';
import { ChatPage } from '../pages/chat/chat.component';

//Pages
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp, EncounterPage, NotesPage, ChatPage, TabsPage, CampaignPage
  ],
  imports: [
    SharedModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HomeModule,
    OptionsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, EncounterPage, NotesPage, ChatPage, TabsPage, CampaignPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
