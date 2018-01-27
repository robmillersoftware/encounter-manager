import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[home-host]',
})
export class HomeDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}