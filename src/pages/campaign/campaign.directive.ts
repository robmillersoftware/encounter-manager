import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[campaign-host]',
})
export class CampaignDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}