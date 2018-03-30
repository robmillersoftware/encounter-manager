import { Character, Location } from '@shared/objects';

interface EncounterData {
  location?: Location,
  participants?: Array<Character>
}

export class Encounter {
  public location: Location;
  public participants: Array<Character>;

  constructor(data: EncounterData) {
    this.location = data.location;
    this.participants = data.participants;
  }
}

export class EncounterFactory {
  static createEncounter(location?: Location, participants?: Array<Character>): Encounter {
    return new Encounter({location: location, participants: participants});
  }

  static fromJSON(json: string): Encounter {
    return new Encounter(<EncounterData>JSON.parse(json));
  }
}
