import { Component, Input } from '@angular/core';
import { CharacterViewComponent } from '../character-view.component';

@Component({
  templateUrl: './character-new.html'
})
export class CharacterNew implements CharacterViewComponent {
  @Input() data: any;
  @Input() name: string;
}

