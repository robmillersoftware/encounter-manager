import { Component } from '@angular/core';
import { Campaign } from '../../shared/objects/index';
import { UserService } from '../../shared/services/user.service';

@Component({
    templateUrl: 'encounter.html'
})
export class EncounterPage {
    public currentCampaign: Campaign;

    constructor(public userService: UserService) {
        this.userService.getCurrentCampaign().then(campaign => {
            this.currentCampaign = campaign;
        });
    }
}