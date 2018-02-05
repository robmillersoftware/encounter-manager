import { Participant } from './participant';

export class Message {
    public timestamp: Date;

    constructor(public contents: any, public from: Participant) {
        this.timestamp = new Date();
    }

    public getTimestamp(): string {
        let t = this.timestamp;
        let date = [ t.getMonth() + 1, t.getDate(), t.getFullYear()];
        let time = [ t.getHours() + '', t.getMinutes() + '', t.getSeconds() + ''];

        for (let i of time) {
            if ( Number(i) < 10 ) {
                i = "0" + i;
            }
        }

        return date.join('/') + " " + time.join(':');
    }
}