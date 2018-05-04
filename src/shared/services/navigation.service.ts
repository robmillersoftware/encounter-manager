import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HeaderData } from '@shared/objects';

/**
* This service manages CRUD operations for characters in local storage
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class NavigationService {
  public headerData: BehaviorSubject<HeaderData>;

  constructor() {
    let defaultHeader = new HeaderData('RetConnected', false);
    this.headerData = new BehaviorSubject(defaultHeader);
  }

  public setHeaderData(o: HeaderData) {
    this.headerData.next(o);
  }
}
