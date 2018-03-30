/**
* This file contains classes related to the Location object. It uses a factory
* pattern to avoid the need to pass around the LocationData interface and to
* make object construction more intuitive.
*/

interface LocationData {
  name: string,
  description: string
}

export class Location {
  public name: string;
  public description: string;

  constructor(loc: LocationData) {
    this.name = loc.name;
    this.description = loc.description;
  }
}

export class LocationFactory {
  static createLocation(name: string, description: string): Location {
    return new Location({name: name, description: description});
  }

  static fromJSON(json: string): Location {
    return new Location(<LocationData>JSON.parse(json));
  }
}
