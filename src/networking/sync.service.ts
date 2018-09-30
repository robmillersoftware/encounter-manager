import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NetworkingService } from '@networking';

/**
* This service holds some state information when navigating between pages
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class SyncService {
  private syncHandlers: Map<string, BehaviorSubject<string>>;

  constructor(private networkingService: NetworkingService) {
    this.syncHandlers = new Map<string, BehaviorSubject<string>>();
  }

  public updateSyncedObject(name: string, json: string, shouldForward: boolean) {
    if (!this.syncHandlers.has(name)) {
      this.syncHandlers.set(name, new BehaviorSubject<string>(null));
    }

    this.syncHandlers.get(name).next(json);

    if (shouldForward) {
      this.networkingService.sync(name, json);
    }
  }
}
