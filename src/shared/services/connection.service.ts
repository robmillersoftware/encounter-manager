import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UserService } from '@shared/services';
import { BroadcastTypes } from '@globals';

interface WifiDirectDevice {
  deviceAddress: string;
  lastMessage: string;
}

@Injectable()
export class ConnectionService {
  private isIos: boolean;
  private isCordova: boolean;
  public peersSubject: BehaviorSubject<String[]>;
  public serviceSubject: BehaviorSubject<Array<string>>;

  constructor(private platform: Platform, private userService: UserService)
  {
    this.isIos = this.platform.is("ios");
    this.isCordova = this.platform.is("cordova");
    this.peersSubject = new BehaviorSubject([]);
    this.serviceSubject = new BehaviorSubject(null);

    if (this.isCordova) {
      window["WifiDirect"].subscribeToPeers(peers => {
        this.peersSubject.next(peers);
      });

      window["WifiDirect"].subscribeToServices(services => {
        let messages: Array<string> = Object.keys(services).map(v => {
          console.log("Msg = " + services[v]);
          return services[v].message;
        });
        this.serviceSubject.next(messages);
      });
    }
  }

  public subscribeToPeers(cb) {
    this.peersSubject.subscribe(cb);
  }

  public subscribeToServices(cb) {
    this.serviceSubject.subscribe(cb);
  }

  public broadcastService(msg: string, type: BroadcastTypes, state: string = '') {
    let broadcast = {
      userName: this.userService.name,
      deviceId: this.userService.id,
      type: type,
      message: msg
    }

    window["WifiDirect"].broadcastService(JSON.stringify(broadcast), state);
  }
}
