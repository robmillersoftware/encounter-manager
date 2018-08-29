export enum MessageTypes {
  MESSAGE,
  JOIN,
  LEAVE,
  ROUTING,
  ADVERTISE,
  DISCOVERED
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
  let obj = JSON.parse(json);
  switch(obj.type) {
    case MessageTypes.MESSAGE:
      return P2PMessageFactory.createMessage(obj.source, obj.dest, obj.message);
    case MessageTypes.JOIN:
      return P2PMessageFactory.createJoinMessage(obj.source, obj.message);
    case MessageTypes.LEAVE:
      return P2PMessageFactory.createLeaveMessage(obj.source);
    case MessageTypes.ROUTING:
      return P2PMessageFactory.createRoutingMessage(obj.message);
    case MessageTypes.ADVERTISE:
      return P2PMessageFactory.createAdvertisement(obj.message);
    case MessageTypes.DISCOVERED:
      return P2PMessageFactory.createDiscoveredMessage(obj.s)
  }
}

function stringify(msg: P2PMessage): string {
  switch(msg.type) {
    case MessageTypes.MESSAGE:
    case MessageTypes.JOIN:
    case MessageTypes.LEAVE:
    case MessageTypes.ROUTING:
      return JSON.stringify(msg);
    case MessageTypes.ADVERTISE:
      let brObj = {
        m: msg.message,
        type: msg.type
      };

      //Advertisements need to be short
      if (brObj.m.length > 32) {
        brObj.m = brObj.m.substring(0, 32);
      }

      return JSON.stringify(brObj);
  }
}

export class P2PMessageFactory {
  public static createMessage(src: string, dest: string, msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: dest, message: msg, type: MessageTypes.MESSAGE});
  }

  public static createJoinMessage(src: string, guid: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: guid, type: MessageTypes.JOIN});
  }

  public static createLeaveMessage(src: string = null): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: null, type: MessageTypes.LEAVE});
  }

  public static createAdvertisement(msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: null, destinationAddress: null, message: msg, type: MessageTypes.ADVERTISE});
  }

  public static createRoutingMessage(msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: null, destinationAddress: null, message: msg, type: MessageTypes.ROUTING});
  }

  public static createDiscoveredMessage(src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, destinationAddress: null, message: null, type: MessageTypes.DISCOVERED});
  }

  public static createJoinJson(src: string, guid: string): string {
    return stringify(P2PMessageFactory.createJoinMessage(src, guid));
  }

  public static createLeaveJson(src: string = null): string {
    return stringify(P2PMessageFactory.createLeaveMessage(src));
  }

  public static createAdvertisementJson(msg: string): string {
    return stringify(P2PMessageFactory.createAdvertisement(msg));
  }

  public static createMessageJson(src: string, dest: string, msg: string): string {
    return stringify(P2PMessageFactory.createMessage(src, dest, msg));
  }

  public static createRoutingJson(msg: string) {
    return stringify(P2PMessageFactory.createRoutingMessage(msg));
  }

  public static fromJSON(json: string): P2PMessage {
    return parseJson(json);
  }

  public static toJSON(msg: P2PMessage): string {
    return stringify(msg);
  }
}
