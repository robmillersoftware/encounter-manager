import { Component, ViewChild } from '@angular/core';
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

    constructor(private campaignService: CampaignService) {
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
        this.campaignService.getCurrentCampaign().then(c => {
            if (c) {
                if (c.encounter) {
                    this.tabs.select(2);
                } else {
                    this.tabs.select(1);
                }
            }
        });
    }
}