import { Type } from '@angular/core';

export class CharacterView {
  constructor(public component: Type<any>, public name: string, public data: any) {}
}
