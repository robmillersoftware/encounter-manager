import { Protocol } from '@networking/comms';

export class MockProtocol implements Protocol{
  private isAdvertising: boolean = false;
  private isDiscovering: boolean = false;

  constructor() {}

  public connect(endpoint: string, message: string) {
    console.log('In MockProtocol connect method. Endpoint = ' + endpoint + ', message = ' + message);
  }

  public disconnect(endpoint: string) {
    console.log('In MockProtocol disconnect method. Endpoint = ' + endpoint);
  }
  public disconnectAll() {
    console.log('In MockProtocol disconnectAll method.');
  }

  public setConnectionHandler(callback: any) {
    console.log('In MockProtocol setConnectionHandler method. Callback = ' + typeof callback);
    document.addEventListener( 'connection', callback);
  }

  public setPayloadHandler(callback: any) {
    console.log('In MockProtocol setPayloadHandler method. Callback = ' + typeof callback);
    document.addEventListener( 'payload', callback);
  }

  public setDiscoveryHandler(callback: any) {
    console.log('In MockProtocol setDiscoveryHandler method. Callback = ' + typeof callback);
    document.addEventListener( 'discovery', callback);
  }

  public advertise(msg: string) {
    console.log('In MockProtocol advertise method. Msg = ' + msg);
    if (this.isAdvertising) {
      this.stopAdvertising();
    }

    this.isAdvertising = true;
  }

  public stopAdvertising() {
    console.log('In MockProtocol stopAdvertising');
    this.isAdvertising = false;
  }

  public discover() {
    console.log('In MockProtocol discover');
    if (this.isDiscovering) {
      this.stopDiscovery();
    }

    this.isDiscovering = true;
  }

  public stopDiscovery() {
    console.log('In MockProtocol stopDiscovery');
    this.isDiscovering = false;
  }

  public send(endpoints: string[], msg: string) {
    console.log('In MockProtocol send. Endpoints = ' + endpoints + '. Msg = ' + msg);
  }
}
