import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Character } from '../objects';

@Injectable()
export class CharacterService {
    constructor(public storage: StorageService) {}

    private async queryCharacters() {
        return this.storage.get('characters').then(val => val);
    }

    async getCharacters() {
        return await this.queryCharacters();
    }
    
    async updateCharacter(char: Character) {
        let characters = await this.queryCharacters();
        characters.set(char.name, char);
        this.storage.set('characters', characters);
    }

    async addCharacter(char: Character) {
        let characters = await this.queryCharacters();

        if (!characters.has(char.name)) {
            characters.set(char.name, char);
        }

        this.storage.set('characters', characters);
    }

    async removeCharacter(charName: string) {
        let characters = await this.queryCharacters();

        if (characters.has(charName)) {
            characters.delete(charName);
        }

        this.storage.set('characters', characters);
    }
}