import { debugMap } from '@globals';

interface PayloadData {
  src: string,
  payload: any,
  dest: string,
  type: string
}

export class Payload {
  public src: string;
  public dest: string;
  public type: string;
  public payload: any;

  constructor(data: PayloadData) {
    this.payload = data.payload;
    this.src = data.src;
    this.dest = data.dest;
    this.type = data.type;
  }
}

export class PayloadFactory {
  public static createPayload(payload: any, src: string, dest: string, type: string) {
    return new Payload({payload: payload, src: src, dest: dest, type: type});
  }

  public static fromJSON(json: string): Payload {
    let obj = JSON.parse(json);

    return new Payload({ payload: obj.payload, src: obj.src, dest: obj.dest, type: obj.type });
  }
}
