import { Character } from './character';

export class Player {
    constructor(public name: string, public character: Character, public description: string) {}
}