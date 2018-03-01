import { Character, Location } from '@shared/objects';

export class Encounter {
    constructor(public location?: Location, public participants: Array<Character> = new Array()) {}
}