export interface Protocol {
  connect(endpoint: string, message: string),
  disconnect(endpoint: string),
  disconnectAll(),
  setReceiveHandler(callback: any),
  advertise(msg: string),
  stopAdvertising(),
  discover(),
  stopDiscovery(),
  send(endpoints: string[], msg: string)
}
