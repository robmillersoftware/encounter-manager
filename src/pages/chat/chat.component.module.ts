import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { SharedModule } from '@shared/shared.module';

import { ChatPage } from '@pages';
import { CreateConversationModal } from '@pages/chat/modals';

@NgModule({
    imports: [
        SharedModule,
        IonicPageModule.forChild(ChatPage),
        IonicModule.forRoot(CreateConversationModal)
    ],
    declarations: [
        ChatPage, CreateConversationModal],
    entryComponents: [
        ChatPage, CreateConversationModal],
    exports: [ChatPage]
})
export class ChatModule {}
