import { Injectable } from '@angular/core';
import { StorageService } from '@shared/services';
import { Character } from '@shared/objects';

/**
* This service manages CRUD operations for characters in local storage
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class CharacterService {
    constructor(public storage: StorageService) {}

    /**
    * Get a list of characters from local storage
    */
    private async queryCharacters() {
        return await this.storage.get('characters');
    }

    /**
    * Forwards the results of queryCharacters
    * @return Map<string, Character>
    */
    public async getCharacters() {
        return await this.queryCharacters();
    }

    /**
    * Creates a new character in local storage
    * @param char
    */
    public async addCharacter(char: Character) {
        let characters = await this.queryCharacters();

        //If the character already exists, do nothing
        if (!characters.has(char.name)) {
            characters.set(char.name, char);
        }

        this.storage.set('characters', characters);
    }

    /**
    * Remove a character with the given name from local storage
    * @param charName
    */
    async removeCharacter(charName: string) {
        let characters = await this.queryCharacters();

        //If a matching character can't be found do nothing
        if (characters.has(charName)) {
            characters.delete(charName);
        }

        this.storage.set('characters', characters);
    }
}
