import { Character, Location, Player, Encounter } from '@shared/objects';

export class Campaign {
    constructor(public name: string, public description: string, public characters?: Array<Character>,
                public locations?: Array<Location>, public players?: Array<Player>,
                public encounterHistory?: Array<Encounter>, public encounter?: Encounter) {
    }
}