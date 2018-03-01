import { Character } from '@shared/objects';

export class Player {
    constructor(public name: string, public character: Character, public description: string) {}
}