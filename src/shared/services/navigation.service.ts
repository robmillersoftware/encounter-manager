import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HeaderData } from '@shared/objects';

/**
* This service holds some state information when navigating between pages 
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
