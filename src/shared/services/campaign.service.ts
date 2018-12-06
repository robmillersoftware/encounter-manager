import { Injectable } from '@angular/core';
import { Campaign, CampaignFactory, Player, PlayerFactory, Encounter } from '@shared/objects';
import { CampaignStorage, UserStorage } from '@shared/persistence';
import { NetworkingService } from '@networking';

/**
* This service manages campaigns
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class CampaignService {
  private networkSubscription: any;

  constructor(private campaignStorage: CampaignStorage, private network: NetworkingService, private userStorage: UserStorage) {
    this.network.subscribeToPeers(this.setCurrentPlayers.bind(this));
  }

  /**
  * Adds a new campaign to campaign storage
  * @param c the campaign to add
  */
  public createCampaign(c: Campaign) {
    this.campaignStorage.addCampaign(c);
  }

  /**
  * Subscribes to the current campaign BehaviorSubject
  * @param callback the method to execute when the BehaviorSubject changes
  */
  public subscribeCurrent(callback: any) {
    this.campaignStorage.currentCampaign.subscribe(callback);
  }

  /**
  * Subscribes to the list of campaigns
  * @param callback the method to execute when the BehaviorSubject changes
  */
  public subscribe(callback: any) {
    this.campaignStorage.campaigns.subscribe(callback);
  }

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
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }

    this.network.stopDiscovery();
    this.network.advertise(CampaignFactory.toBroadcast(campaign));
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
      let players = campaign.players;
      players.push(p);
      campaign.players = players;
      this.campaignStorage.updateCampaign(campaign);
    }

    return campaign;
  }

  public setCurrentPlayers(players: Array<any>) {
    console.log("Setting players on current campaign: " + players.join(','));
    let campaign = this.campaignStorage.getCurrentCampaign();
    players.forEach(json => {
      let player: Player = PlayerFactory.fromJSON(json);
      let p = campaign.players.find(item => item.id === player.id);
      if (!p) {
        let playerArr = campaign.players;
        playerArr.push(p);
        campaign.players = playerArr;
        this.updateCampaign(campaign);
      }
    });
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
      let history = campaign.encounterHistory;
      history.push(campaign.activeEncounter);
      campaign.encounterHistory = history;
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

    return campaign ? campaign.gm : null;
  }

  public deleteCampaign(cName: string) {
    let current: Campaign = this.getCurrentCampaign();

    if (current && current.name === cName) {
      console.log("Setting current campaign to null because it was deleted.");
      this.campaignStorage.setCurrentCampaign(null);
      this.network.stopAdvertising();
    }

    this.campaignStorage.deleteCampaign(cName);
  }

  /**
  * Updates an existing campaign
  * @param c The updated version of a campaign
  */
  public updateCampaign(c: Campaign) {
    console.log("Updating campaign: " + JSON.stringify(c));
    let campaign = this.getCurrentCampaign();

    if (campaign && campaign.name === c.name) {
      this.setCurrentCampaign(c);
    }

    this.campaignStorage.updateCampaign(c);
  }

  /**
  * Joins a campaign that is hosted on another device
  * @param c the campaign to join
  */
  public joinCampaign(c: Campaign): Promise<any> {
    return new Promise((resolve, reject) => { {

    }
      if (!c.gm || !c.gm.endpoint) {
        console.log("Tried to join campaign with no gm endpoint.");
        reject();
      }

      let player: Player = PlayerFactory.createPlayer(this.userStorage.getUser().name, this.userStorage.getUser().uuid, null, null);
      this.network.joinNetwork(c.gm.endpoint, JSON.stringify(player));
      resolve();
    });
  }

  /**
  * Discovers campaigns hosted on another device
  * @param callback the method to call upon discovery
  */
  public discoverCampaigns(callback: any) {
    this.networkSubscription = this.network.subscribeToNetworks(callback);
    this.network.discover();
  }

  public updateUserInfo(info: any) {
    let c: Campaign = this.getCurrentCampaign();
    let u: string = this.userStorage.getUser().uuid;

    if (c) {
      let gm = c.gm;
      if (gm.id == u) {
        gm.name = info.name ? info.name : gm.name;
        gm.endpoint = info.endpoint ? info.endpoint : gm.endpoint;
        gm.characters = info.characters ? info.characters : gm.characters;
        c.gm = gm;
      } else {
        let players = c.players;
        players.forEach(player => {
          if (player.id == u) {
            player.name = info.name ? info.name : player.name;
            player.endpoint = info.endpoint ? info.endpoint : player.endpoint;
            player.characters = info.characters ? info.characters : player.characters;
          }
        });
        c.players = players;
      }
    }

    this.updateCampaign(c);
  }
}
