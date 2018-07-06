import { Character, Player, Message } from '@shared/objects';

interface ConversationData {
  messages: Array<Message>,
  id: number,
  isMeta: boolean,
  characters?: Array<Character>,
  players?: Array<Player>
}

export class Conversation {
  public characters: Array<Character>;
  public players: Array<Player>;
  public isMeta: boolean;
  public messages: Array<Message>;
  public id: number;

  constructor(data: ConversationData) {
    this.messages = data.messages;
    this.id = data.id;
    this.isMeta = data.isMeta;
    this.characters = this.isMeta ? null : data.characters;
    this.players = this.isMeta ? data.players : null;
  }
}

export class ConversationFactory {
  private static createConversation(id: number, messages: Array<Message>, isMeta: boolean,
      characters?: Array<Character>, players?: Array<Player>): Conversation {
    return new Conversation({id: id, messages: messages, isMeta: isMeta,
      characters: characters, players: players });
  }

  public static createInGameConversation(id: number, messages: Array<Message>, characters: Array<Character>): Conversation {
    return ConversationFactory.createConversation(id, messages, false, characters);
  }

  public static createMetaConversation(id: number, messages: Array<Message>, players: Array<Player>): Conversation {
    return ConversationFactory.createConversation(id, messages, true, null, players);
  }

  public static fromJson(json: string): Conversation {
    let convo = JSON.parse(json);
    return new Conversation({ id: convo.id, messages: convo.messages, isMeta: convo.isMeta, characters: convo.characters, players: convo.players });
  }
}
