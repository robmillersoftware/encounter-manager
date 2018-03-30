export enum PayloadTypes {
  BYTES,
  FILE,
  STREAM
}

export namespace PayloadTypes {
  export function fromString(str: string): PayloadTypes {
    switch(str) {
      case "BYTES":
        return PayloadTypes.BYTES;
      case "FILE":
        return PayloadTypes.FILE;
      case "STREAM":
        return PayloadTypes.STREAM;
    }
  }
}

export class PayloadDescription {
  private descriptors: Map<string, string>;

  constructor(public type: PayloadTypes) {
    this.descriptors = new Map<string, string>();
  }

  public addDescriptor(key: string, value: string) {
    this.descriptors.set(key, value);
  }

  public contains(key: string): boolean {
    return this.descriptors.has(key);
  }
}

export interface Payload {
  description: PayloadDescription,
  data: any
}
