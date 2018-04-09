/**
* This file contains classes related to the Location object. It uses a factory
* pattern to avoid the need to pass around the LocationData interface and to
* make object construction more intuitive.
* @author Rob Miller
* @copyright 2018
*/

/**
* This interface is used for the construction of Location objects
*/
interface LocationData {
  name: string,
  description: string
}

/**
* This class represents a location in a campaign
*/
export class Location {
  public name: string;
  public description: string;

  constructor(loc: LocationData) {
    this.name = loc.name;
    this.description = loc.description;
  }
}

/**
* This class is responsible for the creation and manipulation of Location objects
*/
export class LocationFactory {
  /**
  * Creates a Location object with the given parameters
  * @param name
  * @param description
  * @return the created Location
  */
  static createLocation(name: string, description: string): Location {
    return new Location({name: name, description: description});
  }

  /**
  * Parses a Location object from a JSON string
  * @param json
  * @return the parsed Location
  */
  static fromJSON(json: string): Location {
    return new Location(<LocationData>JSON.parse(json));
  }
}
