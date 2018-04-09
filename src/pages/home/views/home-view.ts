import { Type } from '@angular/core';

/**
* This class represents a view for the home page.
* @author Rob Miller
* @copyright 2018
*/
export class HomeView {
  constructor(public component: Type<any>,
    public name: string,
    public id: any,
    public data: any) {}
}
