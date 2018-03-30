import { Campaign, Player } from '@shared/objects';

interface UserData {
  name: string,
  id: string,
  currentPlayer?: Player,
  currentCampaign?: Campaign
}

export class User {
  public name: string;
  public id: string;
  public currentPlayer: Player;
  public currentCampaign: Campaign;

  constructor(data: UserData) {
    this.name = data.name;
    this.id = data.id;
    this.currentPlayer = data.hasOwnProperty('currentPlayer') ? data.currentPlayer : null;
    this.currentCampaign = data.hasOwnProperty('currentCampaign') ? data.currentCampaign : null;
  }
}

export class UserFactory {
  static createUser(name: string, id: string, currentPlayer?: Player, currentCampaign?: Campaign): User {
    return new User({name: name, id: id, currentPlayer: currentPlayer, currentCampaign: currentCampaign});
  }

  static fromJSON(json: string): User {
    return new User(<UserData>JSON.parse(json));
  }
}
