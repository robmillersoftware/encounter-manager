import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Campaign, Encounter } from '../objects';
import { StorageService } from './storage.service';

@Injectable()
export class CampaignService {
    //Anything that subscribes to this will be notified when the current campaign
    //changes
    public campaignSubject: BehaviorSubject<Campaign>;

    //Updates subscribers whenever a campaign is loaded or unloaded
    public campaignLoaded: BehaviorSubject<boolean>;

    //Updates subscribers whenever there is an active encounter
    public encounterStarted: BehaviorSubject<boolean>;

    //Updates subscribers with a true/false value as to whether any campaigns have been saved
    public hasCampaigns: BehaviorSubject<boolean>;

    constructor(public storage: StorageService) {
        this.campaignSubject = new BehaviorSubject<Campaign>(null);
        this.campaignLoaded = new BehaviorSubject<boolean>(null);
        this.encounterStarted = new BehaviorSubject<boolean>(null);
        this.hasCampaigns = new BehaviorSubject<boolean>(null);
        this.loadCampaign();
    }

    public async startEncounter(enc: Encounter) {
        let campaign: Campaign = await this.getCurrentCampaign();
        let isLoaded: boolean = campaign ? true : false;

        if (isLoaded && !campaign.encounter) {
            campaign.encounter = enc;
            this.encounterStarted.next(true);

            this.storage.set('currentCampaign', campaign);
            this.updateCampaign(campaign);
        }
    }

    public async endEncounter() {
        let campaign: Campaign = await this.getCurrentCampaign();
        let isLoaded: boolean = campaign ? true : false;

        if (isLoaded) {
            campaign.encounterHistory.push(campaign.encounter);
            campaign.encounter = null;
            this.encounterStarted.next(false);

            this.storage.set('currentCampaign', campaign);
            this.updateCampaign(campaign);
        }
    }

    private async loadCampaign() {
        let campaign: Campaign = await this.getCurrentCampaign();
        
        let isLoaded:boolean = campaign ? true : false;

        this.campaignSubject.next(campaign);
        this.campaignLoaded.next(isLoaded);

        if (isLoaded) {
            this.encounterStarted.next(campaign.encounter ? true : false);
        }
    }

    public async getCurrentCampaign() {
        return this.storage.get('currentCampaign').then(c => c);
    }

    public async updateCampaign(c: Campaign) {
        if (!c) return;

        let campaigns = await this.queryCampaigns();
        campaigns.set(c.name, c);

        this.setCurrentCampaign(c);
    }

    public async setCurrentCampaign(c: Campaign) {
        this.storage.set('currentCampaign', c);
        this.campaignSubject.next(c);
        this.campaignLoaded.next(c ? true : false);

        if (c) {
            this.encounterStarted.next(c.encounter ? true : false);
        }
    }

    private async queryCampaigns() {
        return this.storage.get('campaigns').then(val => val);
    }

    async getCampaigns() {
        let map: Map<string, Campaign> = await this.queryCampaigns();
        this.hasCampaigns.next(map && map.size > 0 ? true : false);
        return map;
    }
    
    async addCampaign(c: Campaign) {
        let campaigns: Map<string, Campaign> = await this.queryCampaigns();

        if (!campaigns.has(c.name)) {
            campaigns.set(c.name, c);
            this.hasCampaigns.next(true);
        }

        this.storage.set('campaigns', Array.from(campaigns.values()));
    }

    async removeCampaign(cName: string) {
        let campaigns: Map<string, Campaign> = await this.queryCampaigns();
        let current: Campaign = await this.getCurrentCampaign();

        if (campaigns.has(cName)) {
            campaigns.delete(cName);
        }
        
        this.hasCampaigns.next(campaigns.size > 0 ? true : false);
        this.storage.set('campaigns', Array.from(campaigns.values()));

        if (current && current.name === cName) {
            this.setCurrentCampaign(null);
        }
    }
}