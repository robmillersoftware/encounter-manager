import { Component, ViewChild } from '@angular/core';
import { HomePage, EncounterPage, ChatPage, NotesPage, CampaignPage } from '../';
import { StorageService } from '../../shared/services/storage.service';

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
    private headerData: any;

    private campaignLoaded: boolean;

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

        this.storage.campaignLoaded.subscribe(val => {
            this.campaignLoaded = val;
        });
    }
}