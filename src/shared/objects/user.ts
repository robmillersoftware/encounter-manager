import { Campaign, Player } from '@shared/objects';

interface UserData {
  name: string,
  id: string,
  endpoint?: string,
  currentCampaign?: Campaign
}

export class User {
  public name: string;
  public id: string;
  public endpoint: string;
  public currentCampaign: Campaign;

  constructor(data: UserData) {
    this.name = data.name;
    this.id = data.id;
    this.endpoint = data.hasOwnProperty('endpoint') ? data.endpoint : null;
    this.currentCampaign = data.hasOwnProperty('currentCampaign') ? data.currentCampaign : null;
  }
}

export class UserFactory {
  static createUser(name: string, id: string, endpoint?: string, currentCampaign?: Campaign): User {
    return new User({name: name, id: id, endpoint: endpoint, currentCampaign: currentCampaign});
  }

  static fromJSON(json: string): User {
    return new User(<UserData>JSON.parse(json));
  }
}
