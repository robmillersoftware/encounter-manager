import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterViewComponent } from '../character-view.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { Character } from '../../../../objects/character';

@Component({
  templateUrl: './character-new.html'
})
export class CharacterNew implements CharacterViewComponent {
  @Input() data: any;
  @Input() name: string;
  @Input() callback: any;

  public character: FormGroup;
  public submitAttempted: boolean;

  constructor(private service: StorageService, private formBuilder: FormBuilder) {
    this.character = this.formBuilder.group({
      charName: ['', Validators.compose[Validators.required, this.service.hasCharacter().bind(this.service)]],
      charDesc: ['']
    });
  }

  createCharacter() {
    let obj = this;

    if (obj.character.get('charName').hasError('has_character')) {
      obj.submitAttempted = true;
    } else {
      obj.submitAttempted = false;

      let char = new Character(obj.character.value.charName, obj.character.value.charDesc);

      obj.service.addCharacter(char).then(() => {
        obj.callback('edit');
      });
    }
  }
}

