import { Character } from "./character";
import { Location } from "./location";

/**
 * This interface represents the bare minimum amount of data needed to 
 * instantiate a Campaign object
 */
export interface CampaignParams {
    name: string;
    description: string;
    characters: Array<Character>;
    locations: Array<Location>;
}

export class Campaign {
    public name: string;
    public description: string;
    private characters: Array<Character>;
    private locations: Array<Location>;

    constructor(data?: CampaignParams) {
        if (!data) {
            this.name = '';
            this.description = '';
            this.characters = new Array<Character>();
            this.locations = new Array<Location>();
        } else {
            this.name = data.name;
            this.description = data.description;
            this.characters = data.characters;
            this.locations = data.locations;
        }
    }

    public addCharacter(char: Character) {
        this.characters.push(char);
    }

    public addLocation(loc: Location) {
        this.locations.push(loc);
    }

    public removeCharacter(char: Character) {
        let i = this.characters.findIndex(item => item.name === char.name);
        this.characters.splice(i, 1);
    }

    public removeLocation(loc: Location) {
        let i = this.locations.findIndex(item => item.name === loc.name);
        this.locations.splice(i, 1);
    }

    public getCharacters() {
        return this.characters;
    }

    public getLocations() {
        return this.locations;
    }
}