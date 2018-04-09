import { Directive, ViewContainerRef } from '@angular/core';

/**
* This class acts as the container for the various views on the home page. No logic
* should be added here as that should all be handled by the components
* @author Rob Miller
* @copyright 2018
*/
@Directive({
  selector: '[home-host]',
})
export class HomeDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
