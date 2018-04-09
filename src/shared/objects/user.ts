/**
* This file contains all of the classes and methods for dealing with User objects
*/
import { Campaign } from '@shared/objects';

/**
* This interface is used for creating User objects
*/
interface UserData {
  name: string,
  id: string,
  endpoint?: string,
  currentCampaign?: Campaign
}

/**
* This class represents the user of this application
*/
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

/**
* This class is responsible for creating and manipulating User objects
*/
export class UserFactory {
  /**
  * Creates a User with the given paramters
  * @param name
  * @param id
  * @param endpoint
  * @param currentCampaign
  * @return the created User
  */
  static createUser(name: string, id: string, endpoint?: string, currentCampaign?: Campaign): User {
    return new User({name: name, id: id, endpoint: endpoint, currentCampaign: currentCampaign});
  }

  /**
  * Parses a User from a JSON string
  * @param json
  * @return parsed User
  */
  static fromJSON(json: string): User {
    return new User(<UserData>JSON.parse(json));
  }
}
