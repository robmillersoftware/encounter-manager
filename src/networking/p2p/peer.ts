export class Peer {
  public address: string;
  public guid: number;

  constructor(address: string, id: number) {
    this.address = address;
    this.guid = id;
  }
}
