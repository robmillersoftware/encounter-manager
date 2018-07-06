import { Injectable } from '@angular/core';
import { Conversation, ConversationFactory, Message, PayloadFactory } from '@shared/objects';
import { ChatStorage } from '@shared/persistence';
import { ConnectionService } from '@shared/services';

/**
* This service handles messages between peer devices
*
* @author Rob Miller
* @copyright 2018
*/
@Injectable()
export class ChatService {
  constructor(public chatStorage: ChatStorage, public connectionService: ConnectionService) {
    //Sets a callback to handle messages coming from the Nearby plugin
    this.connectionService.registerMessageHandler((json: string) => {
      //TODO: Evaluate the payload/message paradigm. Seems shaky
      let payload = PayloadFactory.fromJSON(json);
      let message: Message = payload.payload;

      this.addMessageToConversation(message, message.conversationId);
    });
  }

  /**
  * Returns a list of existing conversations from storage
  */
  public getConversations(): Array<Conversation> {
    return this.chatStorage.conversations.value;
  }

  /**
  * Allows pages and services to subscribe to the list of conversations and listen
  * for updates
  */
  public subscribeToConversations(callback: any) {
    this.chatStorage.conversations.subscribe(callback);
  }

  /**
  * Starts a new conversation between the given participants.
  * @param isMeta true if the conversation is between players, false if it is between
  * characters
  * @param participants list of participants in the conversation. Players if isMeta is true, Characters otherwise
  */
  public startConversation(isMeta: boolean, participants: Array<any>): Conversation {
    let conversations = this.chatStorage.getConversations();

    //Check to see if the player list matches an existing conversation.
    //Edge case, but one we should guard against
    for (let convo of conversations) {
      //Check for same length
      let comparison: boolean = convo.isMeta ? participants.length === convo.players.length :
        participants.length === convo.characters.length;

      if (comparison) {
        //Now check to make sure participants are all the same
        let comparator;
        let convoSorted;

        if (convo.isMeta) {
          comparator = (a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          }

          convoSorted = convo.players.sort(comparator);
        } else {
          comparator = (a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          }

          convoSorted = convo.characters.sort(comparator);
        }

        let participantsSorted = participants.sort(comparator);
        let matched = true;

        for (let i = 0; i < participantsSorted.length; ++i) {
          let result = comparator(participantsSorted[i], convoSorted[i]);
          if (result != 0) {
            matched = false;
            break;
          }
        }

        if (matched) {
          return convo;
        }
      }
    }

    let id = conversations.length;
    let conversation: Conversation;

    //If isMeta, then the created conversation will have a players member. Otherwise it will be characters
    if (isMeta) {
      conversation = ConversationFactory.createMetaConversation(id, new Array<Message>(), participants);
    } else {
      conversation = ConversationFactory.createInGameConversation(id, new Array<Message>(), participants);
    }

    this.chatStorage.addConversation(conversation);

    return conversation;
  }

  /**
  * Updates an existing conversation with a new message
  * @param message the new message
  * @param id the id of the conversation to be updated
  */
  public addMessageToConversation(message: Message, id: number) {
    let conversations= this.chatStorage.getConversations();
    let cIdx = conversations.findIndex((convo => {
      return convo.id == id;
    }));

    if (cIdx != -1) {
      conversations[cIdx].messages.push(message);
      this.chatStorage.updateConversation(conversations[cIdx]);
    }
  }
}
