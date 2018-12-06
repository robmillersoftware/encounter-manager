export interface Protocol {
  connect(endpoint: string, message: string),
  disconnect(endpoint: string),
  disconnectAll(),
  setConnectionHandler(callback: any),
  setDiscoveryHandler(callback: any),
  setPayloadHandler(callback: any),
  advertise(msg: string),
  stopAdvertising(),
  discover(),
  stopDiscovery(),
  send(endpoints: string[], msg: string),
}
