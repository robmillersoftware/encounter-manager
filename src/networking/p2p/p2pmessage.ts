export enum P2PTypes {
  MESSAGE,
  JOIN,
  LEAVE,
  DISCOVERED,
  BROADCAST,
  SYNC
}

interface P2PMessageData {
  type: P2PTypes,
  sourceAddress?: string,
  message?: string
}

export class P2PMessage {
  public source: string;
  public message: string;
  public type: P2PTypes;

  constructor(data: P2PMessageData) {
    this.source = data.sourceAddress ? data.sourceAddress : null;
    this.message = data.message ? data.message : null;
    this.type = data.type;
  }
}

function parseJson(json: string): P2PMessage {
  let obj: any = JSON.parse(json);
  let objType: P2PTypes = (<any>P2PTypes)[obj.type];

  switch(objType) {
    case P2PTypes.MESSAGE:
      return P2PMessageFactory.createMessage(obj.source, obj.message);
    case P2PTypes.JOIN:
      return P2PMessageFactory.createJoinMessage(obj.source);
    case P2PTypes.LEAVE:
      return P2PMessageFactory.createLeaveMessage(obj.source);
    case P2PTypes.DISCOVERED:
      return P2PMessageFactory.createDiscoveredMessage(obj.source, obj.message);
    case P2PTypes.BROADCAST:
      return P2PMessageFactory.createBroadcastMessage(obj.message, obj.s);
    case P2PTypes.SYNC:
      return P2PMessageFactory.createSyncMessage(obj.message);
  }
}

export class P2PMessageFactory {
  public static createMessage(src: string, msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, message: msg, type: P2PTypes.MESSAGE});
  }

  public static createJoinMessage(src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, message: null, type: P2PTypes.JOIN});
  }

  public static createLeaveMessage(src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, message: null, type: P2PTypes.LEAVE});
  }

  public static createDiscoveredMessage(src: string, msg: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, message: msg, type: P2PTypes.DISCOVERED});
  }

  public static createBroadcastMessage(msg: string, src: string): P2PMessage {
    return new P2PMessage({sourceAddress: src, message: msg, type: P2PTypes.BROADCAST});
  }

  public static createSyncMessage(msg: string) {
    return new P2PMessage({sourceAddress: null, message: msg, type: P2PTypes.SYNC});
  }

  public static createJoinJson(src: string): string {
    return JSON.stringify(P2PMessageFactory.createJoinMessage(src));
  }

  public static createMessageJson(src: string, msg: string): string {
    return JSON.stringify(P2PMessageFactory.createMessage(src, msg));
  }

  public static createBroadcastJson(msg: string, src: string): string {
    return JSON.stringify(P2PMessageFactory.createBroadcastMessage(msg, src));
  }

  public static createSyncJson(name: string, msg: string): string {
    let syncObj = {name: name, json: msg};
    return JSON.stringify(P2PMessageFactory.createSyncMessage(JSON.stringify(syncObj)));
  }

  public static fromJSON(json: string): P2PMessage {
    return parseJson(json);
  }

  public static toJSON(msg: P2PMessage): string {
    return JSON.stringify(msg);
  }
}
