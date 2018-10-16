import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
* This service holds some state information when navigating between pages
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class SyncService {
  //These handlers will be updated when data is received from the network
  private serverSyncHandlers: Map<string, BehaviorSubject<string>>;

  //These handlers will be updated when data is modified in the client
  private clientSyncHandlers: Map<string, BehaviorSubject<string>>;

  constructor() {
    this.serverSyncHandlers = new Map<string, BehaviorSubject<string>>();
    this.clientSyncHandlers = new Map<string, BehaviorSubject<string>>();
  }

  public updateSyncedObject(name: string, json: string, isClient: boolean = true) {
    console.log('Updating synced object with name: ' + name + ', ' + json);
    if (isClient) {
      if (!this.clientSyncHandlers.has(name)) {
        this.clientSyncHandlers.set(name, new BehaviorSubject<string>(null));
      }

      this.clientSyncHandlers.get(name).next(json);
    } else {
      if (!this.serverSyncHandlers.has(name)) {
        this.serverSyncHandlers.set(name, new BehaviorSubject<string>(null));
      }

      this.serverSyncHandlers.get(name).next(json);
    }
  }

  public subscribeToServerSync(name: string, callback: any) {
    if (this.serverSyncHandlers.has(name)) {
      this.serverSyncHandlers.get(name).subscribe(callback);
    }
  }

  public subscribeToClientSync(name: string, callback: any) {
    if (this.clientSyncHandlers.has(name)) {
      this.clientSyncHandlers.get(name).subscribe(callback);
    }
  }
}
