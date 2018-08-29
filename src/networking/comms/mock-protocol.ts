import { Protocol } from '@networking/comms';

export class MockProtocol implements Protocol{
  constructor() {}

  public connect(endpoint: string) {}
  public disconnect(endpoint: string) {}
  public disconnectAll() {}
  public setReceiveHandler(callback: any) {}
  public advertise(msg: string) {}
  public stopAdvertising() {}
  public discover() {}
  public stopDiscovery() {}
  public send(endpoints: string[], msg: string) {}
}
