import { Injectable } from '@angular/core';
import { Character, Location, Campaign } from '../objects';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import { CampaignService } from './';

@Injectable()
export class UserService {
    public name: string;
    public roles: Map<string, string>;

    private locations: Map<string, Location>;
    private characters: Map<string, Character>;
    private campaigns: Map<string, Campaign>;

    private currentCampaign: Campaign;

    constructor(public campaignService: CampaignService) {}

    async getCurrentCampaign() { 
        this.currentCampaign = await this.campaignService.getCurrentCampaign();
        return this.currentCampaign;
    }

    async setCurrentCampaign(c: Campaign) {
        this.currentCampaign = c;
        await this.campaignService.setCurrentCampaign(c);
    }

    hasCampaign(): ValidatorFn {        
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

    hasLocation(): ValidatorFn {        
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

    hasCharacter(): ValidatorFn {        
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

}