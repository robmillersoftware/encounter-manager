import { Protocol } from '@networking/comms';

export class MockProtocol implements Protocol{
  constructor() {}

  public connect(endpoint: string, message: string) {}
  public disconnect(endpoint: string) {}
  public disconnectAll() {}
  public setConnectionHandler(callback: any) {}
  public setPayloadHandler(callback: any) {}
  public setDiscoveryHandler(callback: any) {}
  public advertise(msg: string) {}
  public stopAdvertising() {}
  public discover() {}
  public stopDiscovery() {}
  public send(endpoints: string[], msg: string) {}
}
