import { Character, Location } from './';

export class Encounter {
    constructor(public location?: Location, public participants: Array<Character> = new Array()) {}
}