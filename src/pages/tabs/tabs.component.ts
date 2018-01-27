import { Component, ViewChild } from '@angular/core';
import { HomePage, EncounterPage, ChatPage, NotesPage, CampaignPage } from '../';
import { StorageService } from '../../shared/services/storage.service';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('tabs') tabs: any;

    homePage: any;
    encounterPage: any;
    chatPage: any;
    notesPage: any;
    campaignPage: any;
    headerData: any;

    constructor(private storage: StorageService) {
        this.homePage = HomePage;
        this.encounterPage = EncounterPage;
        this.chatPage = ChatPage;
        this.notesPage = NotesPage;
        this.campaignPage = CampaignPage;

        this.storage.getCurrentCampaign().then(campaign => {
            if (campaign) {
                this.tabs.select(1);
            }
        });
    }
}