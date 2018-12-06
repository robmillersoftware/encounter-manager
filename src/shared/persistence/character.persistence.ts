import { Injectable } from '@angular/core';
import { StorageService } from '@shared/persistence';
import { Character } from '@shared/objects';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/**
* This service manages CRUD operations for characters in local storage
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class CharacterStorage {
  public characters: BehaviorSubject<Map<string, Character>>;

  constructor(public storage: StorageService) {
    this.characters = new BehaviorSubject<Map<string, Character>>(new Map());
    this.loadCharacters();
  }

  /**
  * Loads the initial list of characters into the behavior subject
  */
  private async loadCharacters() {
      let characters: Map<string, Character> = await this.storage.get('characters');

      if (characters) {
        this.setCharacters(characters);
      }
  }

  private setCharacters(chars: Map<string, Character>) {
    this.characters.next(chars);
    this.storage.set('characters', chars);
  }

  /**
  * Returns the current value of the charactes behaviorsubject
  * @return Map<string, Character>
  */
  public getCharacters() {
      return this.characters.value;
  }

  /**
  * Returns a character with the given name
  * @param name the name of the character to be retrieved
  */
  public getCharacter(name: string) {
      let characters: Map<string, Character> = this.characters.value;
      return characters.get(name);
  }

  /**
  * Adds a new character to the behaviorsubject and local storage
  * @param char
  */
  public addCharacter(char: Character) {
      let characters = this.characters.value;

      //If the character already exists, do nothing
      if (!characters.has(char.name)) {
          characters.set(char.name, char);
      }

      this.setCharacters(characters);
  }

  /**
  * Remove a character with the given name from local storage
  * @param charName
  */
  public deleteCharacter(charName: string) {
      let characters = this.characters.value;

      //If a matching character can't be found do nothing
      if (characters.has(charName)) {
          characters.delete(charName);
      }

      this.setCharacters(characters);
  }

  public updateCharacter(character: Character) {
    let characters = this.characters.value;

    if (characters.has(character.name)) {
      characters.set(character.name, character);
    }

    this.setCharacters(characters);
  }
}
