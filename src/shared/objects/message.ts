import { Payload, PayloadTypes, PayloadDescription } from '@shared/objects';

interface MessageData {
  msg: string,
  to: string,
  from: string
}

export class Message implements Payload {
  description: PayloadDescription;
  data: any;

  constructor(data: MessageData) {
    this.data = data.msg;
    this.description = new PayloadDescription(PayloadTypes.BYTES);
    this.description.addDescriptor("to", data.to);
    this.description.addDescriptor("from", data.from);
  }
}

export class MessageFactory {
  public static create(msg: string, to: string, from: string): Message {
    return new Message({msg: msg, to: to, from: from });
  }

  public static fromJSON(json: string): Message {
    let obj = JSON.parse(json);
    let desc = JSON.parse(obj.description);

    return new Message({ msg: obj.data, to: desc.to, from: desc.from });
  }
}
