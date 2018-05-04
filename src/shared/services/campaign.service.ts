/**
* This service manages the campaign storage for the application
* @author Rob Miller
* @copyright 2018
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Campaign, Encounter } from '@shared/objects';
import { StorageService, ConnectionService } from '@shared/services';

@Injectable()
export class CampaignService {
  //Anything that subscribes to this will be notified when the current campaign
  //changes
  public currentCampaignSubject: BehaviorSubject<Campaign>;

  //Updates subscribers whenever a campaign is loaded or unloaded
  public campaignLoaded: BehaviorSubject<boolean>;

  //Updates subscribers whenever there is an active encounter
  public encounterStarted: BehaviorSubject<boolean>;

  //Updates subscribers with a true/false value as to whether any campaigns have been saved
  public hasCampaigns: BehaviorSubject<boolean>;

  //Maintains a list of campaigns from local storage
  public campaignSubject: BehaviorSubject<Map<string, Campaign>>;

  constructor(public storage: StorageService, public connectionService: ConnectionService) {
    this.currentCampaignSubject = new BehaviorSubject<Campaign>(null);
    this.campaignLoaded = new BehaviorSubject<boolean>(false);
    this.encounterStarted = new BehaviorSubject<boolean>(false);
    this.hasCampaigns = new BehaviorSubject<boolean>(false);
    this.campaignSubject = new BehaviorSubject<Map<string, Campaign>>(new Map());

    this.loadCampaigns();
  }

  /**
  * Initializes the application by loading any active campaigns
  */
  private async loadCampaigns() {
    let campaigns: Map<string, Campaign> = await this.storage.get('campaigns');

    if (campaigns) {
      this.setCampaigns(campaigns);
    }
    let campaign: Campaign = await this.getCurrentCampaign();
    let isLoaded:boolean = campaign ? true : false;

    this.currentCampaignSubject.next(campaign);
    this.campaignLoaded.next(isLoaded);

    if (isLoaded) {
      this.encounterStarted.next(campaign.activeEncounter ? true : false);
    }
  }

  private setCampaigns(campaigns: Map<string, Campaign>) {
    this.campaignSubject.next(campaigns);
    this.storage.set('campaigns', campaigns);
  }

  public getCampaigns(): Map<string, Campaign> {
    return this.campaignSubject.value;
  }
  /**
  * Sets the current campaign
  * @param c The campaign to set
  */
  private setCurrentCampaign(c: Campaign) {
    this.currentCampaignSubject.next(c);
    this.storage.set('currentCampaign', c);
    this.campaignLoaded.next(c ? true : false);

    if (c) {
      this.encounterStarted.next(c.activeEncounter ? true : false);
    }
  }

  public joinCampaign(c: Campaign) {
    if (!c) {
      console.log("Unable to join campaign. Value is null");
      return;
    }

    let campaign = this.getCampaign(c.name);
    if (!campaign) {
      this.addCampaign(c);
      campaign = c;
    }

    this.setCurrentCampaign(campaign);
  }

  /**
  * Returns the current campaign
  */
  public getCurrentCampaign(): Campaign {
    return this.currentCampaignSubject.value;
  }

  /**
  * Starts an encounter on the current campaign if there is none active
  * @param enc The new encounter
  */
  public startEncounter(enc: Encounter) {
    let campaign: Campaign = this.currentCampaignSubject.value;
    let isLoaded: boolean = campaign ? true : false;

    if (isLoaded && !campaign.activeEncounter) {
      campaign.activeEncounter = enc;
      this.encounterStarted.next(true);

      this.setCurrentCampaign(campaign);
      this.updateCampaign(campaign);
    }
  }

  /**
  * Ends the active encounter on the current campaign
  */
  public endEncounter() {
    let campaign: Campaign = this.currentCampaignSubject.value;
    let isLoaded: boolean = campaign ? true : false;

    if (isLoaded) {
      campaign.encounterHistory.push(campaign.activeEncounter);
      campaign.activeEncounter = null;
      this.encounterStarted.next(false);

      this.setCurrentCampaign(campaign);
      this.updateCampaign(campaign);
    }
  }

  /**
  * Updates an existing campaign
  * @param c The updated version of a campaign
  */
  public updateCampaign(c: Campaign) {
    if (!c) return;

    let campaigns: Map<string, Campaign> = this.campaignSubject.value;
    campaigns.set(c.name, c);

    this.setCampaigns(campaigns);
  }

  /**
  * Adds a new campaign to the list of campaigns
  * @param c The campaign to add
  */
  public addCampaign(c: Campaign) {
    let campaigns: Map<string, Campaign> = this.campaignSubject.value;

    if (!campaigns.has(c.name)) {
      campaigns.set(c.name, c);
      this.hasCampaigns.next(true);
    }

    this.storage.set('campaigns', Array.from(campaigns.values()));
  }

  /**
  * Removes an existing campaign from the list by name
  * @param cName The name of the campaign to remove
  */
  public removeCampaign(cName: string) {
    let campaigns: Map<string, Campaign> = this.campaignSubject.value;
    let current: Campaign = this.currentCampaignSubject.value;

    if (campaigns.has(cName)) {
      campaigns.delete(cName);
    }

    this.hasCampaigns.next(campaigns.size > 0 ? true : false);
    this.setCampaigns(campaigns);

    if (current && current.name === cName) {
      this.setCurrentCampaign(null);
    }
  }

  /**
  * Finds a campaign by name
  * @param cName The campaign name to search for
  */
  public getCampaign(cName: string): Campaign {
    let campaigns: Map<string, Campaign> = this.campaignSubject.value;
    if (campaigns.has(cName)) {
      return campaigns.get(cName);
    }

    return null;
  }
}
