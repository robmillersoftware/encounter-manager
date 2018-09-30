/**
* This file contains all of the classes and methods for dealing with User objects
*/

/**
* This interface is used for creating User objects
*/
interface UserData {
  name: string
}

/**
* This class represents the user of this application
*/
export class User {
  public name: string;

  constructor(data: UserData) {
    this.name = data.name;
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
  static createUser(name: string): User {
    return new User({name: name});
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
