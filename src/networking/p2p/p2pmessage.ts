export enum MessageTypes {
  MESSAGE,
  JOIN,
  LEAVE,
  DISCOVERED,
  BROADCAST
}

interface P2PMessageData {
  type: MessageTypes,
  sourceAddress?: string,
  destinationAddress?: string,
  message?: string
}

export class P2PMessage {
  public source: string;
  public dest: string;
  public message: string;
  public type: MessageTypes;

  constructor(data: P2PMessageData) {
    this.source = data.sourceAddress ? data.sourceAddress : null;
    this.dest = data.destinationAddress ? data.destinationAddress : null;
    this.message = data.message ? data.message : null;
    this.type = data.type;
  }
}

function parseJson(json: string): P2PMessage {
  let obj: any = JSON.parse(json);
  let objType: MessageTypes = (<any>MessageTypes)[obj.type];

  switch(objType) {
    case MessageTypes.MESSAGE:
      return P2PMessageFactory.createMessage(obj.source, obj.dest, obj.message);
    case MessageTypes.JOIN:
      return P2PMessageFactory.createJoinMessage(obj.source, obj.dest);
    case MessageTypes.LEAVE:
      return P2PMessageFactory.createLeaveMessage(obj.source);
    case MessageTypes.DISCOVERED:
      return P2PMessageFactory.createDiscoveredMessage(obj.source, obj.message);
    case MessageTypes.BROADCAST:
      return P2PMessageFactory.createBroadcastMessage(obj.message, obj.s);
  }
}

export class P2PMessageFactory {
  public static createMessage(src: string, dest: string, msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: dest, message: msg, type: MessageTypes.MESSAGE});
  }

  public static createJoinMessage(src: string, dest: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: dest, message: null, type: MessageTypes.JOIN});
  }

  public static createLeaveMessage(src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: null, type: MessageTypes.LEAVE});
  }

  public static createDiscoveredMessage(src: string, msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: msg, type: MessageTypes.DISCOVERED});
  }

  public static createBroadcastMessage(msg: string, src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: msg, type: MessageTypes.BROADCAST});
  }

  public static createJoinJson(src: string, dest: string): string {
    return JSON.stringify(P2PMessageFactory.createJoinMessage(src, dest));
  }

  public static createMessageJson(src: string, dest: string, msg: string): string {
    return JSON.stringify(P2PMessageFactory.createMessage(src, dest, msg));
  }

  public static createBroadcastJson(msg: string, src: string): string {
    return JSON.stringify(P2PMessageFactory.createBroadcastMessage(msg, src));
  }

  public static fromJSON(json: string): P2PMessage {
    return parseJson(json);
  }

  public static toJSON(msg: P2PMessage): string {
    return JSON.stringify(msg);
  }
}
