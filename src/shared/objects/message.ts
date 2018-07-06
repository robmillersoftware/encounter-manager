import { Player } from '@shared/objects';

interface MessageData {
  sender: Player,
  contents: string,
  id: number,
  conversationId: number
}

export class Message {
  public sender: Player;
  public contents: string;
  public id: number;
  public conversationId: number;

  constructor(data: MessageData) {
      this.sender = data.sender;
      this.contents = data.contents;
      this.id = data.id;
      this.conversationId = data.conversationId;
  }
}

export class MessageFactory {
  public static createMessage(from: Player, contents: string, id: number, conversation: number): Message {
    return new Message({ sender: from, contents: contents, id: id, conversationId: conversation });
  }

  public static fromJson(json: string): Message {
    let msg = JSON.parse(json);
    return new Message({ sender: msg.sender, contents: msg.contents, id: msg.id, conversationId: msg.conversationId });
  }
}
