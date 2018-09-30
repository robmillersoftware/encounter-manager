import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Conversation, MessageFactory } from '@shared/objects';
import { ChatService } from '@shared/services';

@Component({
    selector: 'message-input',
    templateUrl: 'message-input.html',
})
export class MessageInput {
  @Input() conversation: Conversation;
  private messageInfo: FormGroup;

  constructor(private formBuilder: FormBuilder, private chatService: ChatService) {
    this.messageInfo = this.formBuilder.group({
      msgText: ['']
    });
  }

  public addMessage() {
    let player = this.conversation.players.find(p => {
      return p.endpoint === null;
    });

    let message = MessageFactory.createMessage(player, this.messageInfo.value.msgText,
      this.conversation.messages.length, this.conversation.id);

    this.chatService.addMessageToConversation(message, this.conversation.id);
    this.messageInfo.reset();
  }
}
