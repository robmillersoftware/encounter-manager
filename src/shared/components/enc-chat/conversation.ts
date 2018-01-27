import { Participant } from './participant';
import { Message } from './message';

export class Conversation {
    public messages: Array<Message>;
    
    constructor(public participants: Array<Participant>) {
    }

    public addMessage(msg: any, participant: Participant) {
        let message = new Message(msg, participant);
        this.messages.push(message);

        this.notifyParticipants(message);
    }

    notifyParticipants(msg: Message) {
        let obj = this;
        obj.participants.forEach(party => party.notify({ message: msg }));
    }
}