import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { CharacterService } from '@shared/services';
import { CharacterFactory } from '@shared/objects';

@Component({
  templateUrl: './character-new.html'
})
export class CharacterNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public character: FormGroup;
  public submitAttempted: boolean;

  constructor(private characterService: CharacterService, private formBuilder: FormBuilder) {
    this.character = this.formBuilder.group({
      charName: ['', Validators.required],
      charDesc: ['']
    });
  }

  getTitle() {
    return "Create New Character"
  }

  createCharacter() {
    let obj = this;

    if (obj.character.get('charName').hasError('has_character')) {
      obj.submitAttempted = true;
    } else {
      obj.submitAttempted = false;

      let char = CharacterFactory.createCharacter(obj.character.value.charName, obj.character.value.charDesc);

      obj.characterService.addCharacter(char).then(() => {
        obj.callback('pageChange', 'character-edit');
      });
    }
  }
}
