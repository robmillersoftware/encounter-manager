import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HomePage, EncounterPage, ChatPage, NotesPage, CampaignPage } from '@pages';
import { CampaignService } from '@shared/services';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('tabs') tabs: any;

  private homePage: any;
  private encounterPage: any;
  private chatPage: any;
  private notesPage: any;
  private campaignPage: any;

  private campaignLoaded: boolean;
  private hasEncounter: boolean;

  constructor(public platform: Platform, private campaignService: CampaignService) {
    this.homePage = HomePage;
    this.encounterPage = EncounterPage;
    this.chatPage = ChatPage;
    this.notesPage = NotesPage;
    this.campaignPage = CampaignPage;

    this.campaignService.campaignLoaded.subscribe(val => {
      this.campaignLoaded = val;
    });

    this.campaignService.encounterStarted.subscribe(val => {
      this.hasEncounter = val;
    });
  }

  ionViewDidLoad() {
    if (this.hasEncounter) {
      this.tabs.select(2);
    } else if (this.campaignLoaded) {
      this.tabs.select(1);
    }
  }
}
