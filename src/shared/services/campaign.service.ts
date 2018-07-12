import { Injectable } from '@angular/core';
import { Campaign, Player, Encounter } from '@shared/objects';
import { CampaignStorage } from '@shared/persistence';
import { ConnectionService } from '@shared/services';

/**
* This service manages campaigns
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class CampaignService {
  constructor(private campaignStorage: CampaignStorage, private connectionService: ConnectionService) {}

  /**
  * Returns a map of campaigns from storage.
  * @return a map of campaigns with key = campaign name
  */
  public getCampaigns(): Map<string, Campaign> {
    return this.campaignStorage.campaigns.value;
  }

  /**
  * Returns the current campaign from storage
  */
  public getCurrentCampaign(): Campaign {
    return this.campaignStorage.currentCampaign.value;
  }

  /**
  * Returns a campaign with the given name
  * @param name
  */
  public getCampaign(name: string): Campaign {
    return this.campaignStorage.getCampaign(name);
  }

  /**
  * Wraps the campaign persistence setCurrentCampaign method
  * @param campaign
  */
  public setCurrentCampaign(campaign: Campaign) {
    this.campaignStorage.setCurrentCampaign(campaign);
  }

  /**
  * Adds a player to a campaign's list of players.
  * @param c a campaign object
  * @param p a player object
  */
  public addPlayerToCampaign(c: Campaign, p: Player) {
    let campaign = this.campaignStorage.getCampaign(c.name);

    if (campaign) {
      campaign.players.push(p);
      this.campaignStorage.updateCampaign(campaign);
    }

    return campaign;
  }

  /**
  * Starts an encounter on the current campaign if there is none active
  * @param enc The new encounter
  */
  public startEncounter(enc: Encounter) {
    let campaign: Campaign = this.campaignStorage.getCurrentCampaign();

    if (campaign && !campaign.activeEncounter) {
      campaign.activeEncounter = enc;
      this.campaignStorage.updateCampaign(campaign);
    }
  }

  /**
  * Ends the active encounter on the current campaign
  */
  public endEncounter() {
    let campaign: Campaign = this.campaignStorage.getCurrentCampaign();

    if (campaign && campaign.activeEncounter) {
      campaign.encounterHistory.push(campaign.activeEncounter);
      campaign.activeEncounter = null;

      this.campaignStorage.updateCampaign(campaign);
    }
  }

  /**
  * Returns a player object representing the GM of the given campaign
  * @param campaignName the name of the campaign
  */
  public getGm(campaignName: string): Player {
    let campaign: Campaign = this.campaignStorage.getCampaign(campaignName);

    if (campaign) {
      for (let player of campaign.players) {
        if (player.isGm) {
          return player;
        }
      }
    }

    return null;
  }

  public deleteCampaign(cName: string) {
    let current: Campaign = this.getCurrentCampaign();

    if (current && current.name === cName) {
      console.log("Setting current campaign to null because it was deleted.");
      this.campaignStorage.setCurrentCampaign(null);
      this.connectionService.advertiseCampaign(null, null);
    }

    this.campaignStorage.deleteCampaign(cName);
  }
}
