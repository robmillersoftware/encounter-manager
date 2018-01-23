import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import { Location } from '../../objects/location';
import { Character } from '../../objects/character';
import { Campaign } from '../../objects/campaign';

@Injectable()
export class StorageService {
    private locations: Map<string, Location>;
    private characters: Map<string, Character>;
    private campaigns: Map<string, Campaign>;

    constructor(public storage: Storage) {
        this.queryLocations();
        this.queryCharacters();
        this.queryCampaigns();
    }

    private async queryLocations() {
        let obj = this;

        return obj.storage.get('locations').then(val => {
            if (!val) {
                obj.locations = new Map<string, Location>();
            } else {
                obj.locations = val;
            }

            return obj.locations;
        });
    }

    async getLocations() {
        return await this.queryLocations();
    }
    
    async addLocation(loc: Location) {
        await this.queryLocations();

        if (!this.locations.has(loc.name)) {
            this.locations.set(loc.name, loc);
        }

        this.storage.set('locations', this.locations);
    }

    removeLocation(locName: string) {
        this.locations.delete(locName);
        this.storage.set('locations', this.locations);
    }

    hasLocation(): ValidatorFn {        
        this.queryLocations();

        let obj = this;
        return (control: AbstractControl): {[key: string]: any} => {
            let input = control.value;
            let isValid = !obj.locations.has(input);

            if (!isValid) {
                return { 'has_location': { isValid }};
            } else {
                return null;
            }
        }; 
    }

    private async queryCharacters() {
        let obj = this;

        return obj.storage.get('characters').then(val => {
            if (!val) {
                obj.characters = new Map<string, Character>();
            } else {
                obj.characters = val;
            }

            return obj.characters;
        });
    }

    async getCharacters() {
        return await this.queryCharacters();
    }
    
    async addCharacter(loc: Character) {
        await this.queryCharacters();

        if (!this.characters.has(loc.name)) {
            this.characters.set(loc.name, loc);
        }

        this.storage.set('characters', this.characters);
    }

    removeCharacter(locName: string) {
        this.characters.delete(locName);
        this.storage.set('characters', this.characters);
    }

    hasCharacter(): ValidatorFn {        
        this.queryCharacters();

        let obj = this;
        return (control: AbstractControl): {[key: string]: any} => {
            let input = control.value;
            let isValid = !obj.characters.has(input);

            if (!isValid) {
                return { 'has_character': { isValid }};
            } else {
                return null;
            }
        }; 
    }

    private async queryCampaigns() {
        let obj = this;

        return obj.storage.get('campaigns').then(val => {
            if (!val) {
                obj.campaigns = new Map<string, Campaign>();
            } else {
                obj.campaigns = val;
            }

            return obj.campaigns;
        });
    }

    async getCampaigns() {
        return await this.queryCampaigns();
    }
    
    async addCampaign(loc: Campaign) {
        await this.queryCampaigns();

        if (!this.campaigns.has(loc.name)) {
            this.campaigns.set(loc.name, loc);
        }

        this.storage.set('campaigns', this.campaigns);
    }

    removeCampaign(locName: string) {
        this.campaigns.delete(locName);
        this.storage.set('campaigns', this.campaigns);
    }

    hasCampaign(): ValidatorFn {        
        this.queryCampaigns();

        let obj = this;
        return (control: AbstractControl): {[key: string]: any} => {
            let input = control.value;
            let isValid = !obj.campaigns.has(input);

            if (!isValid) {
                return { 'has_campaign': { isValid }};
            } else {
                return null;
            }
        }; 
    }

    async getCampaign(name: string) {
        await this.queryCampaigns();
        return this.campaigns.get(name);
    }
}