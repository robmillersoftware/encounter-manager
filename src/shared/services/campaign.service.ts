/**
* This service manages the campaign storage for the application
* @author Rob Miller
* @author robmillersoftware@gmail.com
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Campaign, Encounter } from '@shared/objects';
import { StorageService, ConnectionService } from '@shared/services';

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

  constructor(public storage: StorageService, public connectionService: ConnectionService) {
    this.campaignSubject = new BehaviorSubject<Campaign>(null);
    this.campaignLoaded = new BehaviorSubject<boolean>(null);
    this.encounterStarted = new BehaviorSubject<boolean>(null);
    this.hasCampaigns = new BehaviorSubject<boolean>(null);
    this.loadCampaign();
  }

  /**
  * Starts an encounter on the current campaign if there is none active
  * @param enc The new encounter
  */
  public async startEncounter(enc: Encounter) {
    let campaign: Campaign = await this.getCurrentCampaign();
    let isLoaded: boolean = campaign ? true : false;

    if (isLoaded && !campaign.activeEncounter) {
      campaign.activeEncounter = enc;
      this.encounterStarted.next(true);

      this.storage.set('currentCampaign', campaign);
      this.updateCampaign(campaign);
    }
  }

  /**
  * Ends the active encounter on the current campaign
  */
  public async endEncounter() {
    let campaign: Campaign = await this.getCurrentCampaign();
    let isLoaded: boolean = campaign ? true : false;

    if (isLoaded) {
      campaign.encounterHistory.push(campaign.activeEncounter);
      campaign.activeEncounter = null;
      this.encounterStarted.next(false);

      this.storage.set('currentCampaign', campaign);
      this.updateCampaign(campaign);
    }
  }

  /**
  * Returns the current campaign
  */
  public async getCurrentCampaign() {
    return this.storage.get('currentCampaign').then(c => c);
  }

  /**
  * Updates an existing campaign
  * @param c The updated version of a campaign
  */
  public async updateCampaign(c: Campaign) {
    if (!c) return;

    let campaigns = await this.queryCampaigns();
    campaigns.set(c.name, c);

    this.setCurrentCampaign(c);
  }

  /**
  * Sets the current campaign. If it is a remote campaign we are trying to
  * join, it also adds it to the list of campaigns
  * @param c The campaign to set
  * @param isRemote true if the campaign came from a network service
  */
  public async setCurrentCampaign(c: Campaign, isRemote: boolean = false) {
    this.storage.set('currentCampaign', c);

    this.campaignSubject.next(c);
    this.campaignLoaded.next(c ? true : false);

    if (c) {
      this.encounterStarted.next(c.activeEncounter ? true : false);
      if (isRemote && !await this.findCampaign(c.name)) {
        await this.addCampaign(c);
      }
    }
  }

  /**
  * Returns a map of campaigns
  */
  public async getCampaigns() {
    let map: Map<string, Campaign> = await this.queryCampaigns();
    this.hasCampaigns.next(map && map.size > 0 ? true : false);
    return map;
  }

  /**
  * Adds a new campaign to the list of campaigns
  * @param c The campaign to add
  */
  public async addCampaign(c: Campaign) {
    let campaigns: Map<string, Campaign> = await this.queryCampaigns();

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
  public async removeCampaign(cName: string) {
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

  /**
  * Finds a campaign by name
  * @param cName The campaign name to search for
  */
  public async findCampaign(cName: string) {
    let campaigns: Map<string, Campaign> = await this.queryCampaigns();
    if (campaigns.has(cName)) {
      return true;
    }

    return false;
  }

  /**
  * Private function to get a list of campaigns to work with
  * @returns a map of campaigns
  */
  private async queryCampaigns() {
    return this.storage.get('campaigns').then(val => val);
  }

  /**
  * Initializes the application by loading any active campaigns
  */
  private async loadCampaign() {
    let campaign: Campaign = await this.getCurrentCampaign();

    let isLoaded:boolean = campaign ? true : false;

    this.campaignSubject.next(campaign);
    this.campaignLoaded.next(isLoaded);

    if (isLoaded) {
      this.encounterStarted.next(campaign.activeEncounter ? true : false);
    }
  }

}
