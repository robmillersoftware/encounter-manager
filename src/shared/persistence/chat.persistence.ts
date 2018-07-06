/**
* This service manages the campaign storage for the application
* @author Rob Miller
* @copyright 2018
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Conversation } from '@shared/objects';
import { StorageService } from '@shared/persistence';

@Injectable()
export class ChatStorage {
  //Maintains a list of campaigns from local storage
  public conversations: BehaviorSubject<Array<Conversation>>;

  constructor(public storage: StorageService) {
    this.conversations = new BehaviorSubject<Array<Conversation>>(null);
    this.initConversations();
  }

  private async initConversations() {
    let conversations: Array<Conversation> = await this.storage.get('conversations');

    if (!conversations) {
      conversations = new Array<Conversation>();
    }

    this.conversations.next(conversations);
  }

  public getConversations(): Array<Conversation> {
    return this.conversations.value;
  }

  public addConversation(convo: Conversation) {
    let conversations = this.conversations.value;
    conversations.push(convo);
    this.conversations.next(conversations);
    this.storage.set('conversations', conversations);
  }

  public updateConversation(convo: Conversation) {
    let conversations = this.conversations.value;
    let idx = conversations.findIndex(conversation => {
      return conversation.id === convo.id;
    });

    if (idx > -1) {
      conversations[idx] = convo;
      this.conversations.next(conversations);
      this.storage.set('conversations', conversations);
    }
  }
}
