import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { NetworkingService } from '@networking';

/**
* This class keeps a map of timestamps for data synchronization. If there are properties that don't exist
* on one or the other, then those properties will not be updated.
*/
export class SyncObject {
  private timestamps: Map<string, number>;

  constructor(other?: SyncObject) {
    if (other) {
      Object.assign(this, other);
    } else {
      this.timestamps = new Map<string, number>();
    }
  }

  public saveField(name: string, value: any) {
    this[name] = value;
    this.timestamps.set(name, Date.now());
  }

  public setTimestamps(ts: Map<string, number>) {
    this.timestamps = ts;
  }

  public getTimestamp(fieldName: string): number {
    return this.timestamps.get(fieldName);
  }

  public getTimestamps(): Map<string, number> {
    return this.timestamps;
  }

  public updateFields(other: SyncObject) {
    this.timestamps.forEach((value, key) => {
      if (value > other.getTimestamp(key)) {
        this[key] = other[key];
        this.timestamps.set(key, Date.now());
      }
    });
  }

  static stringify(o: SyncObject): string {
    let replacer = (name, value) => {
      if (name === 'timestamps') {
        let obj = Object.create(null);
        console.log("TIMESTAMPS: " + o["timestamps"])
        for (let [k, v] of value) {
          obj[k] = v;
        }
        return obj;
      } else {
        return value
      }
    };

    return JSON.stringify(o, replacer);
  }

  static parse(json: string): any {
    console.log("INSIDE PARSE: " + json);
    let reviver = (name, value) => {
      if (name === 'timestamps') {
        let map = new Map<string, number>();
        for (let k of Object.keys(value)) {
          console.log("iterating timestamps: " + k);
          map.set(k, value[k]);
        }
        return map;
      } else {
        return value;
      }
    };

    return JSON.parse(json, reviver);
  }
}

export class SyncMessage {
  public operation: string;
  public name: string;
  public data: SyncObject;

  constructor(name: string, op: string, d: SyncObject) {
    this.operation = op;
    this.data = d;
    this.name = name;
  }

  public static fromJSON(json: string): SyncMessage {
    let rtn = JSON.parse(json, (key, value) => {
      if (key === "data") {
        return SyncObject.parse(JSON.stringify(value));
      } else {
        return value;
      }
    });

    return new SyncMessage(rtn.name, rtn.operation, rtn.data);
  }

  public toJSON(): string {
    return JSON.stringify({ name: this.name, operation: this.operation, data: this.data });
  }
}

export interface SyncStorage {
  receive(operation: string, data: SyncObject);
  send(operation: string, data: string);
}

/**
* This service holds some state information when navigating between pages
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class SyncService {
  private storageServices: Map<string, any>;

  constructor(public networkingService: NetworkingService, private events: Events) {
    this.storageServices = new Map<string, any>();

    this.events.subscribe("sync-received", this.receiveSync.bind(this));
    this.events.subscribe("info-request", this.syncAll.bind(this));
  }

  public registerReceiver(name: string, service: any) {
    this.storageServices.set(name, service.receive.bind(service));
  }

  public receiveSync(data: any) {
    let obj: SyncMessage = SyncMessage.fromJSON(data.message);

    if (this.storageServices.has(obj.name)) {
      this.storageServices.get(obj.name)(obj.operation, obj.data);
    }
  }

  public sendSync(name: string, operation: string, json: string) {
    let syncObj = JSON.parse(json);
    let message: SyncMessage = new SyncMessage(name, operation, syncObj);

    this.networkingService.sendSync(message.toJSON());
  }

  public syncAll() {
    console.log("Syncing all data");
    this.storageServices.forEach(receiver => {
      receiver("read", null);
    });
  }
}
