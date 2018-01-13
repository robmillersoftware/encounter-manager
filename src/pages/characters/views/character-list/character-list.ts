import { Component, Input } from '@angular/core';
import { CharacterViewComponent } from '../character-view.component';

@Component({
  templateUrl: './character-list.html'
})
export class CharacterList implements CharacterViewComponent {
  @Input() data: any;
  @Input() name: string;
}

