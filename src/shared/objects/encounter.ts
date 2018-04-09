/**
* This file contains all classes and methods for dealing with Encounter objects
* @author Rob Miller
* @copyright 2018
*/
import { Character, Location } from '@shared/objects';

/**
* This interface is used to construct Encounter objects
*/
interface EncounterData {
  location?: Location,
  participants?: Array<Character>
}

/**
* This class represents an encounter happening within a campaign.
*/
export class Encounter {
  public location: Location;
  public participants: Array<Character>;

  constructor(data: EncounterData) {
    this.location = data.location;
    this.participants = data.participants;
  }
}

/**
* This class is responsible for creating and manipulating Encounter objects
*/
export class EncounterFactory {
  /**
  * Create an encounter from the provided parameters
  * @param location
  * @param participants
  * @return new Encounter object
  */
  static createEncounter(location?: Location, participants?: Array<Character>): Encounter {
    return new Encounter({location: location, participants: participants});
  }

  /**
  * Parses an Encounter object from a JSON string
  * @param json
  * @return parsed Encounter object
  */
  static fromJSON(json: string): Encounter {
    return new Encounter(<EncounterData>JSON.parse(json));
  }
}
