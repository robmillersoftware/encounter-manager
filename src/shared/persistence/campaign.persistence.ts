/**
* This service manages the campaign storage for the application
* @author Rob Miller
* @copyright 2018
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Campaign, CampaignFactory } from '@shared/objects';
import { StorageService } from '@shared/persistence';
import { SyncStorage, SyncService } from '@networking';

@Injectable()
export class CampaignStorage implements SyncStorage {
  //Anything that subscribes to this will be notified when the current campaign
  //changes
  public currentCampaign: BehaviorSubject<Campaign>;

  //Maintains a list of campaigns from local storage
  public campaigns: BehaviorSubject<Map<string, Campaign>>;

  //Flag to show sync state. If syncing, then updates shouldn't be pushed to network
  private isSyncing: boolean;

  constructor(public storage: StorageService, private syncService: SyncService) {
    this.currentCampaign = new BehaviorSubject<Campaign>(null);
    this.campaigns = new BehaviorSubject<Map<string, Campaign>>(new Map());

    this.loadCampaigns();

    this.syncService.registerReceiver("campaign", this);
  }

  /**
  * Loads existing campaigns from storage
  */
  private async loadCampaigns() {
    let campaigns: Map<string, Campaign> = await this.storage.get('campaigns');

    if (campaigns) {
      this.setCampaigns(campaigns);
    }

    let current: Campaign = await this.storage.get('currentCampaign');

    if (current) {
      this.setCurrentCampaign(current);
    }
  }

  /**
  * Sets campaigns map
  */
  private setCampaigns(campaigns: Map<string, Campaign>) {
    this.campaigns.next(campaigns);
    this.storage.set('campaigns', campaigns);
  }

  /**
  * Returns the current value of the campaigns map
  */
  public getCampaigns(): Map<string, Campaign> {
    return this.campaigns.value;
  }
  /**
  * Sets the current campaign
  * @param c The campaign to set
  */
  public setCurrentCampaign(c: Campaign) {
    this.currentCampaign.next(c);

    //Update the map of campaigns if this one isn't included
    if (c && !this.campaigns.value.has(c.name)) {
      this.addCampaign(c);
    }

    this.storage.set('currentCampaign', c);
  }

  /**
  * Returns the current campaign
  */
  public getCurrentCampaign(): Campaign {
    return this.currentCampaign.value;
  }

  /**
  * Updates an existing campaign
  * @param c The updated version of a campaign
  */
  public updateCampaign(c: Campaign) {
    if (!c) return;

    let campaigns: Map<string, Campaign> = this.campaigns.value;
    campaigns.set(c.name, c);

    if (this.currentCampaign.value.name === c.name) {
      this.setCurrentCampaign(c);
    }

    if (!this.isSyncing) {
      this.send("update", CampaignFactory.toJSON(c));
    }

    this.setCampaigns(campaigns);
  }

  /**
  * Adds a new campaign to the list of campaigns
  * @param c The campaign to add
  */
  public addCampaign(c: Campaign) {
    let campaigns: Map<string, Campaign> = this.campaigns.value;

    if (!campaigns.has(c.name)) {
      campaigns.set(c.name, c);
    }

    if (!this.isSyncing) {
      this.send("create", CampaignFactory.toJSON(c));
    }

    this.setCampaigns(campaigns);
  }

  /**
  * Removes an existing campaign from the list by name
  * @param cName The name of the campaign to remove
  */
  public deleteCampaign(cName: string) {
    let campaigns: Map<string, Campaign> = this.campaigns.value;

    if (campaigns.has(cName)) {
      if (!this.isSyncing) {
        this.send("delete", CampaignFactory.toJSON(campaigns.get(cName)));
      }
      campaigns.delete(cName);
    }

    this.setCampaigns(campaigns);
  }

  /**
  * Finds a campaign by name
  * @param cName The campaign name to search for
  */
  public getCampaign(cName: string): Campaign {
    let campaigns: Map<string, Campaign> = this.campaigns.value;
    if (campaigns.has(cName)) {
      return campaigns.get(cName);
    }

    return null;
  }

  public receive(operation: string, data: Campaign) {
    let c: Campaign = CampaignFactory.cloneCampaign(data);

    this.isSyncing = true;

    console.log("Received sync operation for campaign: " + CampaignFactory.toJSON(c));
    switch(operation) {
      case 'create':
        this.addCampaign(c);
        break;
      case 'read':
        this.send('update', CampaignFactory.toJSON(this.getCurrentCampaign()));
        break;
      case 'update':
        this.updateCampaign(c);
        break;
      case 'delete':
        this.deleteCampaign(c.name);
        break;
    }

    this.isSyncing = false;
  }

  public send(operation: string, data: string) {
    this.syncService.sendSync("campaign", operation, data);
  }
}
