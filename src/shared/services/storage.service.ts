import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Location, Character, Campaign } from '../objects';

@Injectable()
export class StorageService {
    constructor(public storage: Storage) {}

    public setCurrentCampaign(c: Campaign) {
        this.storage.set('currentCampaign', c);
    }

    public async getCurrentCampaign() {
        return this.storage.get('currentCampaign');
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
    
    async addCampaign(loc: Campaign) {
        let campaigns = await this.queryCampaigns();

        if (!campaigns.has(loc.name)) {
            campaigns.set(loc.name, loc);
        }

        this.storage.set('campaigns', campaigns);
    }

    async removeCampaign(locName: string) {
        let campaigns = await this.queryCampaigns();

        campaigns.delete(locName);
        this.storage.set('campaigns', campaigns);
    }

    async getCampaign(name: string) {
        let campaigns = await this.queryCampaigns();
        return campaigns.get(name);
    }
}