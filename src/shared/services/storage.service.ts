import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location, Character, Campaign } from '../objects';

@Injectable()
export class StorageService {
    //Anything that subscribes to this will be notified when the current campaign
    //changes
    public campaignSubject: BehaviorSubject<Campaign>;

    //Updates subscribers whenever a campaign is loaded or unloaded
    public campaignLoaded: BehaviorSubject<boolean>;

    constructor(public storage: Storage) {
        this.campaignSubject = new BehaviorSubject<Campaign>(null);
        this.campaignLoaded = new BehaviorSubject<boolean>(null);
        this.loadCampaign();
    }

    private async loadCampaign() {
        let campaign = await this.getCurrentCampaign();
        let isLoaded:boolean = campaign ? true : false;

        this.campaignSubject.next(campaign);
        this.campaignLoaded.next(isLoaded);
    }

    public setCurrentCampaign(c: Campaign) {
        this.storage.set('currentCampaign', c);
        this.campaignSubject.next(c);
        this.campaignLoaded.next(c ? true : false);
    }

    public async getCurrentCampaign() {
        return this.storage.get('currentCampaign').then(c => c);
    }

    private async queryLocations() {
        let locations: Map<String, Location>;

        return this.storage.get('locations').then(val => {
            if (!val) {
                locations = new Map<string, Location>();
            } else {
                locations = val;
            }

            return locations;
        });
    }

    async getLocations() {
        return await this.queryLocations();
    }
    
    async addLocation(loc: Location) {
        let locations = await this.queryLocations();

        if (!locations.has(loc.name)) {
            locations.set(loc.name, loc);
        }

        this.storage.set('locations', locations);
    }

    async removeLocation(locName: string) {
        let locations = await this.queryLocations();

        locations.delete(locName);
        this.storage.set('locations', locations);
    }

    private async queryCharacters() {
        let characters: Map<String, Character>;

        return this.storage.get('characters').then(val => {
            if (!val) {
                characters = new Map<string, Character>();
            } else {
                characters = val;
            }

            return characters;
        });
    }

    async getCharacters() {
        return await this.queryCharacters();
    }
    
    async addCharacter(loc: Character) {
        let characters = await this.queryCharacters();

        if (!characters.has(loc.name)) {
            characters.set(loc.name, loc);
        }

        this.storage.set('characters', characters);
    }

    async removeCharacter(locName: string) {
        let characters = await this.queryCharacters();

        characters.delete(locName);
        this.storage.set('characters', characters);
    }

    private async queryCampaigns() {
        let campaigns: Map<String, Campaign>;

        return this.storage.get('campaigns').then(val => {
            if (!val) {
                campaigns = new Map<string, Campaign>();
            } else {
                campaigns = val;
            }

            return campaigns;
        });
    }

    async getCampaigns() {
        return await this.queryCampaigns();
    }
    
    async addCampaign(c: Campaign) {
        let campaigns = await this.queryCampaigns();

        if (!campaigns.has(c.name)) {
            campaigns.set(c.name, c);
        }

        this.storage.set('campaigns', campaigns);
    }

    async removeCampaign(cName: string) {
        let campaigns = await this.queryCampaigns();
        let current = await this.getCurrentCampaign();

        campaigns.delete(cName);
        this.storage.set('campaigns', campaigns);

        if (current.name === cName) {
            this.setCurrentCampaign(null);
        }
    }

    async getCampaign(name: string) {
        let campaigns = await this.queryCampaigns();
        return campaigns.get(name);
    }
}