import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeViewComponent } from '../home-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { Character } from '../../../../shared/objects/character';

@Component({
  templateUrl: './character-new.html'
})
export class CharacterNew implements HomeViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public character: FormGroup;
  public submitAttempted: boolean;

  constructor(private storage: StorageService, private user: UserService, private formBuilder: FormBuilder) {
    this.character = this.formBuilder.group({
      charName: ['', Validators.compose[Validators.required, this.user.hasCharacter().bind(this.storage)]],
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

      let char = new Character(obj.character.value.charName, obj.character.value.charDesc);

      obj.storage.addCharacter(char).then(() => {
        obj.callback('pageChange', 'character-edit');
      });
    }
  }
}

