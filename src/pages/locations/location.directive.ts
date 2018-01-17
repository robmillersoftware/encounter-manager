import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[location-host]',
})
export class LocationDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}