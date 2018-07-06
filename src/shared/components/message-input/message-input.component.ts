import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { /*Conversation,*/ MessageFactory } from '@shared/objects';
import { ChatService } from '@shared/services';
import { UserStorage } from '@shared/persistence';

@Component({
    selector: 'message-input',
    templateUrl: 'message-input.html',
})
export class MessageInput {
  private _conversation;//: Conversation;
  private messageInfo: FormGroup;

  constructor(private formBuilder: FormBuilder, private userStorage: UserStorage,
      private chatService: ChatService) {
    this.messageInfo = this.formBuilder.group({
      msgText: ['']
    });
  }

  public addMessage() {
    let player = this._conversation.players.find(p => {
      return p.id === this.userStorage.getIdentifier();
    })

    let message = MessageFactory.createMessage(player, this.messageInfo.value.msgText,
      this._conversation.messages.length, this._conversation.id);

    this.chatService.addMessageToConversation(message, this._conversation.id);
    this.messageInfo.reset();
  }

  @Input()
  get conversation() {
    return this._conversation;
  }

  set conversation(conv) {//}: Conversation) {
    this._conversation = conv;
  }
}
