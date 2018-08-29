import { Injectable } from '@angular/core';
import { Character } from '@shared/objects';
import { CharacterStorage } from '@shared/persistence';

/**
* This service manages characters
*
* @author Rob Miller
* @copyright 2018
*/
//TODO: Does this need work?
@Injectable()
export class CharacterService {
  constructor(private characterStorage: CharacterStorage) {}

  /**
  * Subscribes to changes in the list of Characters
  * @param callback the method to execute when the character list is changed
  */
  public subscribe(callback: any) {
    this.characterStorage.characters.subscribe(callback);
  }

  /**
  * Adds a character to the list
  * @param char the Character to add
  */
  public addCharacter(char: Character) {
    this.characterStorage.addCharacter(char);
  }

  /**
  * Returns a map of characters from storage.
  * @return a map of characters with key = character name
  */
  public getCharacters(): Map<string, Character> {
    return this.characterStorage.characters.value;
  }

  /**
  * Returns a character with the given name
  * @param name
  */
  public getCharacter(name: string): Character {
    return this.characterStorage.getCharacter(name);
  }

  /**
  * Deletes a character from storage
  * @param cName the name of the character to delete
  */
  public deleteCharacter(cName: string) {
    this.characterStorage.deleteCharacter(cName);
  }
}
